import UserNotification from './models/user-notification.model';
import EntityAccessUserNotification from './models/entity-access-user-notification.model';
import EntityUserNotification from './models/entity-user-notification.model';
import MessageUserNotification from './models/message-user-notification.model';
import { respondWithResult, handleEntityNotFound, handleError } from '../util';
import { userNotificationTypes } from '../../config/environment';

// Returns the notifications of the user based given by req.query.notificationType
export function index(req, res) {
    // TODO: Sanitize request
    // TODO: Paginate results
    var userId = req.user._id.toString();
    return UserNotification.find({
        ...req.query,
        user: userId,
    })
        .sort({ createdAt: 'desc' })
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Creates a new notification.
export function create(req, res) {
    Reflect.deleteProperty(req.body, '_id');
    Reflect.deleteProperty(req.body, 'createdAt');
    req.body.createdBy = req.user._id;

    const NotificationModel = getUserNotificationModel(req.body.notificationType);

    return NotificationModel.create(req.body)
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}

// Archives the notification specified.
export function archive(req, res) {
    return UserNotification.findById(req.params.id)
        .exec()
        .then(handleEntityNotFound(res))
        .then(archiveNotification())
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// HELPER FUNCTIONS

/**
 * Returns the Mongoose model that matches the notification type specified.
 * @param {*} notificationType
 */
function getUserNotificationModel(notificationType) {
    switch (notificationType) {
    case userNotificationTypes.ENTITY_ACCESS_NOTIFICATION.value:
        return EntityAccessUserNotification;
    case userNotificationTypes.ENTITY_NOTIFICATION.value:
        return EntityUserNotification;
    case userNotificationTypes.MESSAGE_NOTIFICATION.value:
        return MessageUserNotification;
    default:
        throw new Error(`Unknown user notification type: ${notificationType}`);
    }
}

function archiveNotification() {
    return function (notification) {
        if (notification) {
            notification.archived = true;
            return notification.save();
        }
        return null;
    };
}
