/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/datasets              ->  index
 * POST    /api/datasets              ->  create
 * GET     /api/datasets/:id          ->  show
 * PUT     /api/datasets/:id          ->  upsert
 * PATCH   /api/datasets/:id          ->  patch
 * DELETE  /api/datasets/:id          ->  destroy
 */

import {
    applyPatch
} from 'fast-json-patch';
import Dataset from './dataset.model';

function respondWithResult(res, statusCode) {
    statusCode = statusCode || 200;
    return entity => {
        if (entity) {
            return res.status(statusCode).json(entity);
        }
        return null;
    };
}

function patchUpdates(patches) {
    return entity => {
        try {
            applyPatch(entity, patches, /*validate*/ true);
        } catch (err) {
            return Promise.reject(err);
        }

        return entity.save();
    };
}

function removeEntity(res) {
    return entity => {
        if (entity) {
            return entity.remove()
                .then(() => res.status(204).end());
        }
    };
}

function handleEntityNotFound(res) {
    return entity => {
        if (!entity) {
            res.status(404).end();
            return null;
        }
        return entity;
    };
}

function handleError(res, statusCode) {
    statusCode = statusCode || 500;
    return err => {
        res.status(statusCode).send(err);
    };
}

// Gets a list of Datasets
export function index(req, res) {
    return Dataset.find().exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Gets a single Dataset from the DB
export function show(req, res) {
    return Dataset.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Creates a new Dataset in the DB
export function create(req, res) {
    return Dataset.create(req.body)
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}

// Upserts the given Dataset in the DB at the specified ID
export function upsert(req, res) {
    if (req.body._id) {
        Reflect.deleteProperty(req.body, '_id');
    }
    return Dataset
        .findOneAndUpdate({
            _id: req.params.id
        }, req.body, {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
            runValidators: true
        }).exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Updates an existing Dataset in the DB
export function patch(req, res) {
    if (req.body._id) {
        Reflect.deleteProperty(req.body, '_id');
    }
    return Dataset.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(patchUpdates(req.body))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Deletes a Dataset from the DB
export function destroy(req, res) {
    return Dataset.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
}
