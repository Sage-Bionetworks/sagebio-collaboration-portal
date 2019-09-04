import Notification from '../models/notification.model';
import MessageNotification from '../models/message-notification.model';
// import EntityAccessNotification from '../models/entity-access-notification.model';
// import EntityNotification from '../models/entity-notification.model';

import {
    respondWithResult,
    handleEntityNotFound,
    handleError
} from '../../util';
// import config from '../../../config/environment';

// function getModelForNotificationType(notificationType) {
//     switch (notificationType) {
//     case config.notificationTypes.ENTITY_ACCESS_NOTIFICATION.value:
//         return EntityAccessNotification;
//     case config.notificationTypes.ENTITY_NOTIFICATION.value:
//         return EntityNotification;
//     case config.notificationTypes.MESSAGE_NOTIFICATION.value:
//         return MessageNotification;
//     default:
//         return MessageNotification;
//     }
// }

// Returns the message notifications of the user
export function indexMine(req, res) {
    var userId = req.user._id.toString();
    // const NotificationModel = getModelForNotificationType(req.query.type);
    return Notification.find({
        ...req.query,
        user: userId
    })
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

// Creates a new MessageNotification
// export function create(req, res) {
//     Reflect.deleteProperty(req.body, '_id');
//     Reflect.deleteProperty(req.body, 'createdAt');
//     req.body.createdBy = req.user._id;

//     return MessageNotification.create(req.body)
//         .then(respondWithResult(res, 201))
//         .catch(handleError(res));
// }
