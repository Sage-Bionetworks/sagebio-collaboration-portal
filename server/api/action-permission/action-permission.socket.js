/**
 * Broadcast updates to client when the model changes
 */

import ActionPermissionEvents from './action-permission.events';
import {
    isAdmin
} from '../../auth/auth';

// Model events to emit
var events = ['save', 'remove'];

export function register(spark) {
    // Bind model events to socket events
    for (let event of events) {
        var listener = createListener(`actionPermission:${event}`, spark);

        ActionPermissionEvents.on(event, listener);
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
        ActionPermissionEvents.removeListener(event, listener);
    };
}

function belongsToUser(doc, userId) {
    return new Promise((resolve) => {
        const targetUserId = doc.user._id ? doc.user._id : doc.user;
        return resolve(userId && targetUserId.toString() === userId.toString());
    });
}
