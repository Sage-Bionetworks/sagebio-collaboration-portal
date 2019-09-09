import { respondWithResult, removeEntity, handleEntityNotFound, handleError } from '../util';
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

// Creates a new ActionPermission in the DB
export function create(req, res) {
    Reflect.deleteProperty(req.body, 'createdAt');
    req.body.createdBy = req.user._id.toString();

    return ActionPermission.create(req.body)
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}

// Deletes a ActionPermission from the DB
export function destroy(req, res) {
    return ActionPermission.findById(req.params.id)
        .exec()
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
}
