/**
 * Broadcast updates to client when the model changes
 */

import * as authBase from '../../auth/auth';
import { entityTypes, accessTypes, inviteStatusTypes } from '../../config/environment';
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
        authBase.canReadEntity(
            spark.userId,
            doc.entityId,
            entityTypes.PROJECT.value,
            doc.visibility,
            Object.values(accessTypes).map(access => access.value),
            [
                inviteStatusTypes.ACCEPTED.value,
                inviteStatusTypes.PENDING.value
            ]
        )
            .then(hasAccess => {
                if (hasAccess) {
                    spark.emit(`${namespace}:${event}`, doc);
                    spark.emit(`entity:${doc.entityId}:${namespace}:${event}`, doc);
                }
            })
            .catch(err => console.error(`Unable to create listener: ${err}`));
    };
}

function removeListener(event, listener) {
    return function () {
        EntityPermissionEvents.removeListener(event, listener);
    };
}
