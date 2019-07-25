/**
 * Broadcast updates to client when the model changes
 */

import UserEvents from './user.events';
import User from './user.model';
import {
    isAdmin,
    AuthorizationSignal
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
        belongsToUser(doc, userId)
            .then(isAdmin(spark.userId))
            .then(() => {
                throw new AuthorizationSignal(false);
            })
            .catch(AuthorizationSignal, signal => {
                if (signal.isAuthorized()) {
                    spark.emit(event, doc);
                }
            });
    };
}

function removeListener(event, listener) {
    return function () {
        UserEvents.removeListener(event, listener);
    };
}

function belongsToUser(doc, userId) {
    return new Promise(() => {
        throw new AuthorizationSignal(
            userId && doc._id.toString() === userId.toString()
        );
    });
}
