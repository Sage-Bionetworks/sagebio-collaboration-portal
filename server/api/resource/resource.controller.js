/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/resources              ->  index
 * POST    /api/resources              ->  create
 * GET     /api/resources/:id          ->  show
 * PUT     /api/resources/:id          ->  upsert
 * PATCH   /api/resources/:id          ->  patch
 * DELETE  /api/resources/:id          ->  destroy
 */

import {
    applyPatch
} from 'fast-json-patch';
import Resource from './models/resource.model';

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

export function indexByEntity(req, res) {
    let filters = req.query;
    filters.projectId = req.params.entityId;
    return Resource.find(filters)
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Gets a list of Resources
export function index(req, res) {
    return Resource.find(req.query)
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Gets a single Resource from the DB
export function show(req, res) {
    return Resource.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Creates a new Resource in the DB
export function create(req, res) {
    return Resource.create({
        ...req.body,
        createdBy: req.user._id
    })
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}

// Upserts the given Resource in the DB at the specified ID
export function upsert(req, res) {
    if (req.body._id) {
        Reflect.deleteProperty(req.body, '_id');
    }
    return Resource
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

// Updates an existing Resource in the DB
export function patch(req, res) {
    if (req.body._id) {
        Reflect.deleteProperty(req.body, '_id');
    }
    return Resource.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(patchUpdates(req.body))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// // Deletes a Resource from the DB
// export function destroy(req, res) {
//     return Resource.findById(req.params.id).exec()
//         .then(handleEntityNotFound(res))
//         .then(removeEntity(res))
//         .catch(handleError(res));
// }
