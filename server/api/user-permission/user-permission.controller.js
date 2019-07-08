/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/user-permissions              ->  index
 * POST    /api/user-permissions              ->  create
 * GET     /api/user-permissions/:id          ->  show
 * PUT     /api/user-permissions/:id          ->  upsert
 * PATCH   /api/user-permissions/:id          ->  patch
 * DELETE  /api/user-permissions/:id          ->  destroy
 */

import {
    applyPatch
} from 'fast-json-patch';
import UserPermission from './user-permission.model';

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

// Gets a list of UserPermissions
export function index(req, res) {
    return UserPermission.find().exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Gets a single UserPermission from the DB
export function show(req, res) {
    return UserPermission.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Creates a new UserPermission in the DB
export function create(req, res) {
    return UserPermission.create(req.body)
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}

// Upserts the given UserPermission in the DB at the specified ID
export function upsert(req, res) {
    if (req.body._id) {
        Reflect.deleteProperty(req.body, '_id');
    }
    return UserPermission.findOneAndUpdate({
        user: req.params.id
    }, req.body, {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true
    }).exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Updates an existing UserPermission in the DB
export function patch(req, res) {
    if (req.body._id) {
        Reflect.deleteProperty(req.body, '_id');
    }
    return UserPermission.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(patchUpdates(req.body))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Deletes a UserPermission from the DB
export function destroy(req, res) {
    return UserPermission.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
}

// Returns the permissions of the user
export function indexMine(req, res) {
    var userId = req.user._id;
    return UserPermission.find({
        user: userId
    })
        .exec()
        .then(userPermissions => {
            if (userPermissions) {
                return userPermissions.map(userPermission => ({
                    value: userPermission.permission
                }));
            }
            return [];
        })
        .then(respondWithResult(res))
        .catch(handleError(res));
}
