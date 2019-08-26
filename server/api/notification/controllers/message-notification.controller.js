import MessageNotification from './models/message-notification.model';
import {
    respondWithResult,
    handleEntityNotFound,
    removeEntity,
    handleError
} from '../util';

// Gets a list of MessageNotifications
export function index(req, res) {
    return MessageNotification.find()
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Gets a single MessageNotification from the DB
export function show(req, res) {
    return MessageNotification
        .findById(req.params.id)
        .exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Returns the message notifications of the user
export function indexMine(req, res) {
    var userId = req.user._id;
    return MessageNotification.find({
        user: userId
    })
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Creates a new MessageNotification
export function create(req, res) {
    Reflect.deleteProperty(req.body, '_id');
    Reflect.deleteProperty(req.body, 'createdAt');
    req.body.createdBy = req.user._id;

    return MessageNotification.create(req.body)
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}

// Deletes a MessageNotification from the DB
export function destroy(req, res) {
    return MessageNotification.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
}
