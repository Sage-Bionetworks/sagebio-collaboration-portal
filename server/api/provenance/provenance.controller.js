import {
    applyPatch
} from 'fast-json-patch';
import Provenance from './provenance.model';
import rp from 'request-promise';

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

// Returns the entire provenance graph
export function getProvenanceGraph(req, res) {
    var options = {
        uri: 'https://jsonplaceholder.typicode.com/todos/1',
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true
    };

    rp(options)
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// // Gets a single Provenance from the DB
// export function show(req, res) {
//     return Provenance.findById(req.params.id).exec()
//         .then(handleEntityNotFound(res))
//         .then(respondWithResult(res))
//         .catch(handleError(res));
// }
//
// // Creates a new Provenance in the DB
// export function create(req, res) {
//     return Provenance.create(req.body)
//         .then(respondWithResult(res, 201))
//         .catch(handleError(res));
// }
//
// // Upserts the given Provenance in the DB at the specified ID
// export function upsert(req, res) {
//     if(req.body._id) {
//         Reflect.deleteProperty(req.body, '_id');
//     }
//     return Provenance.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()
//         .then(respondWithResult(res))
//         .catch(handleError(res));
// }
//
// // Updates an existing Provenance in the DB
// export function patch(req, res) {
//     if(req.body._id) {
//         Reflect.deleteProperty(req.body, '_id');
//     }
//     return Provenance.findById(req.params.id).exec()
//         .then(handleEntityNotFound(res))
//         .then(patchUpdates(req.body))
//         .then(respondWithResult(res))
//         .catch(handleError(res));
// }
//
// // Deletes a Provenance from the DB
// export function destroy(req, res) {
//     return Provenance.findById(req.params.id).exec()
//         .then(handleEntityNotFound(res))
//         .then(removeEntity(res))
//         .catch(handleError(res));
// }
