import EntityNotification from '../models/entity-notification.model';
import {
    respondWithResult,
    handleEntityNotFound,
    removeEntity,
    handleError
} from '../../util';

// Gets a list of EntityNotifications
export function index(req, res) {
    return EntityNotification.find()
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Gets a single EntityNotification from the DB
export function show(req, res) {
    return EntityNotification
        .findById(req.params.id)
        .exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Returns the entity notifications of the user
export function indexMine(req, res) {
    var userId = req.user._id;
    console.log('userId: ?????', userId);
    return EntityNotification.find({
        userId
    })
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Creates a new EntityNotification
export function create(req, res) {
    Reflect.deleteProperty(req.body, '_id');
    Reflect.deleteProperty(req.body, 'createdAt');
    req.body.createdBy = req.user._id;

    return EntityNotification.create(req.body)
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}

// Deletes a EntityNotification from the DB
export function destroy(req, res) {
    return EntityNotification.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
}
