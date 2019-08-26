/**
 * Broadcast updates to client when the model changes
 */

import {
    hasAccessToEntity,
} from '../../auth/auth';
import config from '../../config/environment';
import EntityPermissionEvents from './entity-permission.events';

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
        hasAccessToEntity(spark.userId, [
                config.accessTypes.READ.value,
                config.accessTypes.WRITE.value,
                config.accessTypes.ADMIN.value
            ], doc.entityId, [
                config.inviteStatusTypes.ACCEPTED.value,
                config.inviteStatusTypes.PENDING.value  // invite to send to user
            ])
            .then(hasAccess => {
                if (hasAccess) {
                    spark.emit(`${namespace}:${event}`, doc);
                    spark.emit(`entity:${doc.entityId}:${namespace}:${event}`, doc);
                }
            })
            .catch(err => {
                console.log(`ERROR creating listener: ${err}`);
            });
    };
}

function removeListener(event, listener) {
    return function () {
        EntityPermissionEvents.removeListener(event, listener);
    };
}
