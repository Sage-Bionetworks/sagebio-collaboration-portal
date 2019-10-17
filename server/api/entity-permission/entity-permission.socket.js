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
        // For now we only support entity-permission for PROJECT
        // ENTITY-PERMISSION ARE NO LONGER USED AS NOTIFICATIONS (SEE NEW USER-NOTIFICATION).
        // TODO Use authentication implementation from project api (no duplicated code)
        if (doc.entityType === entityTypes.PROJECT.value) {
            const isTargetUser = doc.user._id === spark.userId;
            const isProjectAdmin = authBase.hasEntityPermission(
                spark.userId,
                doc.entityId,
                entityTypes.PROJECT.value,
                [accessTypes.ADMIN.value],
                [inviteStatusTypes.ACCEPTED.value]
            );
            if (isTargetUser || isProjectAdmin) {
                spark.emit(`${namespace}:${event}`, doc);
                spark.emit(`entity:${doc.entityId}:${namespace}:${event}`, doc);
            }
        }
    };
}

function removeListener(event, listener) {
    return function () {
        EntityPermissionEvents.removeListener(event, listener);
    };
}
