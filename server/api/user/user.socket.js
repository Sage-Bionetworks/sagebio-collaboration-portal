/**
 * Broadcast updates to client when the model changes
 */

import UserEvents from './user.events';

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
        if (isAuthorized(doc, spark.userId)) {
            spark.emit(event, doc);
        }
    };
}

function removeListener(event, listener) {
    return function () {
        UserEvents.removeListener(event, listener);
    };
}

function isAuthorized(doc, userId) {
    return userId && doc._id.toString() === userId.toString();
}
