import {
    respondWithResult,
    patchUpdates,
    handleEntityNotFound,
    handleError
} from '../util';
import Insight from './models/insight.model';

export function indexByEntity(req, res) {
    let filters = req.query;
    filters.projectId = req.params.entityId;
    return Insight.find(filters)
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

export function index(req, res) {
    let filters = req.query;
    return Insight.find(filters)
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Gets a single Insight from the DB
export function show(req, res) {
    return Insight
        .findById(req.params.id)
        .exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Creates a new Insight in the DB
export function create(req, res) {
    return Insight.create({
        ...req.body,
        createdBy: req.user._id
    })
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}

// Upserts the given Insight in the DB at the specified ID
export function upsert(req, res) {
    if (req.body._id) {
        Reflect.deleteProperty(req.body, '_id');
    }
    return Insight
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

// Updates an existing Insight in the DB
export function patch(req, res) {
    if (req.body._id) {
        Reflect.deleteProperty(req.body, '_id');
    }
    return Insight.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(patchUpdates(req.body))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// // Deletes a Insight from the DB
// export function destroy(req, res) {
//     return Insight.findById(req.params.id).exec()
//         .then(handleEntityNotFound(res))
//         .then(removeEntity(res))
//         .catch(handleError(res));
// }
