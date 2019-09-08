import { respondWithResult, patchUpdates, removeEntity, handleEntityNotFound, handleError } from '../util';
import ActionPermission from './action-permission.model';

// Returns the permissions of the user
export function index(req, res) {
    var userId = req.user._id;
    return ActionPermission.find({
        user: userId,
    })
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Gets a list of ActionPermissions
export function indexByUser(req, res) {
    return ActionPermission.find({ user: req.params.userId })
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// // Gets a single ActionPermission from the DB
// export function show(req, res) {
//     return ActionPermission.findById(req.params.id).exec()
//         .then(handleEntityNotFound(res))
//         .then(respondWithResult(res))
//         .catch(handleError(res));
// }

// // Creates a new ActionPermission in the DB
// export function create(req, res) {
//     return ActionPermission.create(req.body)
//         .then(respondWithResult(res, 201))
//         .catch(handleError(res));
// }

// // Upserts the given ActionPermission in the DB at the specified ID
// export function upsert(req, res) {
//     if (req.body._id) {
//         Reflect.deleteProperty(req.body, '_id');
//     }
//     return ActionPermission.findOneAndUpdate({
//         user: req.params.id
//     }, req.body, {
//         new: true,
//         upsert: true,
//         setDefaultsOnInsert: true,
//         runValidators: true
//     }).exec()
//         .then(respondWithResult(res))
//         .catch(handleError(res));
// }

// // Updates an existing ActionPermission in the DB
// export function patch(req, res) {
//     if (req.body._id) {
//         Reflect.deleteProperty(req.body, '_id');
//     }
//     return ActionPermission.findById(req.params.id).exec()
//         .then(handleEntityNotFound(res))
//         .then(patchUpdates(req.body))
//         .then(respondWithResult(res))
//         .catch(handleError(res));
// }

// // Deletes a ActionPermission from the DB
// export function destroy(req, res) {
//     return ActionPermission.findById(req.params.id).exec()
//         .then(handleEntityNotFound(res))
//         .then(removeEntity(res))
//         .catch(handleError(res));
// }
