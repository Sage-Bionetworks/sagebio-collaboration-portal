import Notification from './models/notification.model';
import MessageNotification from './models/message-notification.model';
import EntityAccessNotification from './models/entity-access-notification.model';
import EntityNotification from './models/entity-notification.model';

import {
    respondWithResult,
    handleEntityNotFound,
    handleError
} from '../util';
import config from '../../config/environment';

function getModelForNotificationType(notificationType) {
    switch (notificationType) {
    case config.notificationTypes.ENTITY_ACCESS_NOTIFICATION.value:
        return EntityAccessNotification;
    case config.notificationTypes.ENTITY_NOTIFICATION.value:
        return EntityNotification;
    case config.notificationTypes.MESSAGE_NOTIFICATION.value:
        return MessageNotification;
    default:
        return MessageNotification;
    }
}

// Returns the notifications of the user based given by req.query.notificationType
export function indexMine(req, res) {
    var userId = req.user._id.toString();
    return Notification.find({
        ...req.query,
        user: userId
    })
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Archive selected notification and returns it
export function archive(req, res) {
    return Notification.findById(req.params.id)
        .exec()
        .then(handleEntityNotFound(res))
        .then(notification => {
            notification.archived = true;
            return notification.save();
        })
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Creates a new Notification
export function create(req, res) {
    Reflect.deleteProperty(req.body, '_id');
    Reflect.deleteProperty(req.body, 'createdAt');
    req.body.createdBy = req.user._id;

    const NotificationModel = getModelForNotificationType(req.body.notificationType);

    return NotificationModel.create(req.body)
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}
