/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/data-catalogs              ->  index
 * POST    /api/data-catalogs              ->  create
 * GET     /api/data-catalogs/:id          ->  show
 * PUT     /api/data-catalogs/:id          ->  upsert
 * PATCH   /api/data-catalogs/:id          ->  patch
 * DELETE  /api/data-catalogs/:id          ->  destroy
 */

import { applyPatch } from 'fast-json-patch';
import DataCatalog from './data-catalog.model';

function respondWithResult(res, statusCode) {
    statusCode = statusCode || 200;
    return function(entity) {
        if(entity) {
            return res.status(statusCode).json(entity);
        }
        return null;
    };
}

function patchUpdates(patches) {
    return function(entity) {
        try {
            applyPatch(entity, patches, /*validate*/ true);
        } catch(err) {
            return Promise.reject(err);
        }

        return entity.save();
    };
}

function removeEntity(res) {
    return function(entity) {
        if(entity) {
            return entity.remove()
                .then(() => res.status(204).end());
        }
    };
}

function handleEntityNotFound(res) {
    return function(entity) {
        if(!entity) {
            res.status(404).end();
            return null;
        }
        return entity;
    };
}

function handleError(res, statusCode) {
    statusCode = statusCode || 500;
    return function(err) {
        res.status(statusCode).send(err);
    };
}

// Gets a list of DataCatalogs
export function index(req, res) {
    return DataCatalog.find().exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Gets a single DataCatalog from the DB
export function show(req, res) {
    return DataCatalog.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Creates a new DataCatalog in the DB
export function create(req, res) {
    return DataCatalog.create(req.body)
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}

// Upserts the given DataCatalog in the DB at the specified ID
export function upsert(req, res) {
    if(req.body._id) {
        Reflect.deleteProperty(req.body, '_id');
    }
    return DataCatalog.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Updates an existing DataCatalog in the DB
export function patch(req, res) {
    if(req.body._id) {
        Reflect.deleteProperty(req.body, '_id');
    }
    return DataCatalog.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(patchUpdates(req.body))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Deletes a DataCatalog from the DB
export function destroy(req, res) {
    return DataCatalog.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
}
