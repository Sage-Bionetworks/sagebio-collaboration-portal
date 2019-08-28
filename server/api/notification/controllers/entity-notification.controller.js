import EntityNotification from '../models/entity-notification.model';
import {
    respondWithResult,
    handleEntityNotFound,
    handleError
} from '../../util';

// Returns the entity notifications of the user
export function indexMine(req, res) {
    var userId = req.user._id.toString();
    return EntityNotification.find({
        ...req.query,
        userId
    })
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

// Creates a new EntityNotification
export function create(req, res) {
    Reflect.deleteProperty(req.body, '_id');
    Reflect.deleteProperty(req.body, 'createdAt');
    req.body.createdBy = req.user._id;

    return EntityNotification.create(req.body)
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}

