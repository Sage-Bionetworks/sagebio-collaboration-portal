/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/starred-messages              ->  index
 * POST    /api/starred-messages              ->  create
 * GET     /api/starred-messages/:id          ->  show
 * PUT     /api/starred-messages/:id          ->  upsert
 * PATCH   /api/starred-messages/:id          ->  patch
 * DELETE  /api/starred-messages/:id          ->  destroy
 */

import {
    applyPatch
} from 'fast-json-patch';
import StarredMessage from './starred-message.model';
import User from '../user/user.model';

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

// Gets a list of StarredMessages
export function index(req, res) {
    var userId = req.user._id;
    return User.findById(userId)
        .exec()
        .then(user => {
            if (!user) {
                return res.status(404).end(); // TODO: return auth error code
            }
            return StarredMessage
                .find({ starredBy: userId })
                .select('-starredBy')
                .exec();
        })
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Gets a single StarredMessage from the DB
export function show(req, res) {
    return StarredMessage.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Creates a new StarredMessage in the DB
export function create(req, res) {
    return StarredMessage.create(req.body)
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}

// Upserts the given StarredMessage in the DB at the specified ID
export function upsert(req, res) {
    if (req.body._id) {
        Reflect.deleteProperty(req.body, '_id');
    }
    return StarredMessage.findOneAndUpdate({
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

// Updates an existing StarredMessage in the DB
export function patch(req, res) {
    if (req.body._id) {
        Reflect.deleteProperty(req.body, '_id');
    }
    return StarredMessage.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(patchUpdates(req.body))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Deletes a StarredMessage from the DB
export function destroy(req, res) {
    return StarredMessage.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
}
