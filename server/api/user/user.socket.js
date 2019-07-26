/**
 * Broadcast updates to client when the model changes
 */

import UserEvents from './user.events';
import User from './user.model';
import {
    isAdmin
} from '../../auth/auth';

// Model events to emit
var events = ['save', 'remove'];

export function register(spark) {
    // Bind model events to socket events
    for (let event of events) {
        var listener = createListener(`user:${event}`, spark);

        UserEvents.on(event, listener);
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
        UserEvents.removeListener(event, listener);
    };
}

function belongsToUser(doc, userId) {
    return new Promise((resolve) => {
        return resolve(userId && doc._id.toString() === userId.toString());
    });
}
