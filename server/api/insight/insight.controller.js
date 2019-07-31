/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/insights              ->  index
 * POST    /api/insights              ->  create
 * GET     /api/insights/:id          ->  show
 * PUT     /api/insights/:id          ->  upsert
 * PATCH   /api/insights/:id          ->  patch
 * DELETE  /api/insights/:id          ->  destroy
 */

import {
    applyPatch
} from 'fast-json-patch';
import Insight from './models/insight.model';

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
    return Insight.find(filters)
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// // Gets a single Insight from the DB
// export function show(req, res) {
//     return Insight.findById(req.params.id).exec()
//         .then(handleEntityNotFound(res))
//         .then(respondWithResult(res))
//         .catch(handleError(res));
// }
//
// // Creates a new Insight in the DB
// export function create(req, res) {
//     return Insight.create(req.body)
//         .then(respondWithResult(res, 201))
//         .catch(handleError(res));
// }
//
// // Upserts the given Insight in the DB at the specified ID
// export function upsert(req, res) {
//     if (req.body._id) {
//         Reflect.deleteProperty(req.body, '_id');
//     }
//     return Insight
//         .findOneAndUpdate({
//             _id: req.params.id
//         }, req.body, {
//             new: true,
//             upsert: true,
//             setDefaultsOnInsert: true,
//             runValidators: true
//         }).exec()
//         .then(respondWithResult(res))
//         .catch(handleError(res));
// }
//
// // Updates an existing Insight in the DB
// export function patch(req, res) {
//     if (req.body._id) {
//         Reflect.deleteProperty(req.body, '_id');
//     }
//     return Insight.findById(req.params.id).exec()
//         .then(handleEntityNotFound(res))
//         .then(patchUpdates(req.body))
//         .then(respondWithResult(res))
//         .catch(handleError(res));
// }
//
// // Deletes a Insight from the DB
// export function destroy(req, res) {
//     return Insight.findById(req.params.id).exec()
//         .then(handleEntityNotFound(res))
//         .then(removeEntity(res))
//         .catch(handleError(res));
// }
