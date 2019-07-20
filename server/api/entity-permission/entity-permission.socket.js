/**
 * Broadcast updates to client when the model changes
 */

import EntityPermissionEvents from './entity-permission.events';
import config from '../../config/environment';

// Model events to emit
var events = ['save', 'remove'];

export function register(spark) {
    // Bind model events to socket events
    for (let event of events) {
        var listener = createListener('entityPermission', event, spark);

        EntityPermissionEvents.on(event, listener);
        spark.on('disconnect', removeListener(event, listener));
    }
}

function createListener(namespace, event, spark) {
    return function (doc) {
        if (isAuthorized(doc, spark.userId)) {
            spark.emit(event, doc);
        }

        // TODO check authorized
        spark.emit(`${doc.entityType}:${doc.entityId}:${namespace}:${event}`, doc);
        spark.emit(`entity:${doc.entityId}:${namespace}:${event}`, doc);
        console.log(`EMITTING entity:${doc.entityId}:${namespace}:${event}`);
    };
}

function removeListener(event, listener) {
    return function () {
        EntityPermissionEvents.removeListener(event, listener);
    };
}

function isAuthorized(doc, userId) {
    return userId && doc.user._id == userId;  // seems to work even if doc.user is not populated...
}
