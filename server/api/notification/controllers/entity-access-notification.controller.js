import EntityAccessNotification from '../models/entity-access-notification.model';
import {
    respondWithResult,
    handleEntityNotFound,
    removeEntity,
    handleError
} from '../../util';

// Gets a list of EntityAccessNotifications
export function index(req, res) {
    return EntityAccessNotification.find()
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Gets a single EntityAccessNotifications from the DB
export function show(req, res) {
    return EntityAccessNotification
        .findById(req.params.id)
        .exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Returns the entity access notifications of the user
export function indexMine(req, res) {
    var userId = req.user._id;
    return EntityAccessNotification.find({
        userId
    })
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Creates a new EntityAccessNotification
export function create(req, res) {
    Reflect.deleteProperty(req.body, '_id');
    Reflect.deleteProperty(req.body, 'createdAt');
    req.body.createdBy = req.user._id;

    return EntityAccessNotification.create(req.body)
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}

// Deletes a EntityAccessNotification from the DB
export function destroy(req, res) {
    return EntityAccessNotification.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
}
