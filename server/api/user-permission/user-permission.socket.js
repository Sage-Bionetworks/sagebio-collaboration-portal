/**
 * Broadcast updates to client when the model changes
 */

import UserPermissionEvents from './user-permission.events';
import {
    isAdmin
} from '../../auth/auth';

// Model events to emit
var events = ['save', 'remove'];

export function register(spark) {
    // Bind model events to socket events
    for (let event of events) {
        var listener = createListener(`userPermission:${event}`, spark);

        UserPermissionEvents.on(event, listener);
        spark.on('disconnect', removeListener(event, listener));
    }
}


function createListener(event, spark) {
    return function (doc) {
        belongsToUser(doc, spark.userId)
            .then(yes => {
                yes && spark.emit(event, doc);
            })
            .catch(err => {
                console.log(err);
            });
    };
}

function removeListener(event, listener) {
    return function () {
        UserPermissionEvents.removeListener(event, listener);
    };
}

function belongsToUser(doc, userId) {
    return new Promise((resolve) => {
        const targetUserId = doc.user._id ? doc.user._id : doc.user;
        return resolve(userId && targetUserId.toString() === userId.toString());
    });
}
