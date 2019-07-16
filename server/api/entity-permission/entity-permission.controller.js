/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/entity-permissions              ->  index
 * POST    /api/entity-permissions              ->  create
 * GET     /api/entity-permissions/:id          ->  show
 * PUT     /api/entity-permissions/:id          ->  upsert
 * PATCH   /api/entity-permissions/:id          ->  patch
 * DELETE  /api/entity-permissions/:id          ->  destroy
 */

import {
    applyPatch
} from 'fast-json-patch';
import EntityPermission from './entity-permission.model';

function respondWithResult(res, statusCode) {
    statusCode = statusCode || 200;
    return function (entity) {
        if (entity) {
            return res.status(statusCode).json(entity);
        }
        return null;
    };
}

function patchUpdates(patches) {
    return function (entity) {
        try {
            applyPatch(entity, patches, /*validate*/ true);
        } catch (err) {
            return Promise.reject(err);
        }

        return entity.save();
    };
}

function removeEntity(res) {
    return function (entity) {
        if (entity) {
            return entity.remove()
                .then(() => res.status(204).end());
        }
    };
}

function handleEntityNotFound(res) {
    return function (entity) {
        if (!entity) {
            res.status(404).end();
            return null;
        }
        return entity;
    };
}

function handleError(res, statusCode) {
    statusCode = statusCode || 500;
    return function (err) {
        res.status(statusCode).send(err);
    };
}

// Gets a list of EntityPermissions
export function index(req, res) {
    return EntityPermission.find()
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Gets a single EntityPermission from the DB
// export function show(req, res) {
//     return EntityPermission.findById(req.params.id).exec()
//         .then(handleEntityNotFound(res))
//         .then(respondWithResult(res))
//         .catch(handleError(res));
// }

// Creates a new EntityPermission in the DB
// export function create(req, res) {
//     return EntityPermission.create(req.body)
//         .then(respondWithResult(res, 201))
//         .catch(handleError(res));
// }

// Upserts the given EntityPermission in the DB at the specified ID
// export function upsert(req, res) {
//     if(req.body._id) {
//         Reflect.deleteProperty(req.body, '_id');
//     }
//     return EntityPermission.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()
//         .then(respondWithResult(res))
//         .catch(handleError(res));
// }

// Updates an existing EntityPermission in the DB
// export function patch(req, res) {
//     if(req.body._id) {
//         Reflect.deleteProperty(req.body, '_id');
//     }
//     return EntityPermission.findById(req.params.id).exec()
//         .then(handleEntityNotFound(res))
//         .then(patchUpdates(req.body))
//         .then(respondWithResult(res))
//         .catch(handleError(res));
// }

// Deletes a EntityPermission from the DB
// export function destroy(req, res) {
//     return EntityPermission.findById(req.params.id)
//         .exec()
//         .then(handleEntityNotFound(res))
//         .then(removeEntity(res))
//         .catch(handleError(res));
// }

// Returns the permissions of the user
export function indexMine(req, res) {
    var userId = req.user._id;
    return EntityPermission.find({
            user: userId
        })
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}
