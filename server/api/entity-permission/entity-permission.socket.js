/**
 * Broadcast updates to client when the model changes
 */

import EntityPermissionEvents from './entity-permission.events';
import { hasAccessToEntity } from '../../auth/auth.service';

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
        const userRole = doc.user.role || '';
        const userId = doc.user._id || '';
        // We only want admin users to be able to listen to these events
        const requestedPermission = 'admin';
        const entityId = doc.entityId || '';

        hasAccessToEntity(userRole, userId, requestedPermission, entityId)
            .then(isGrantedAccess => {
                const isAuthorizedToAccessEntity = isGrantedAccess;

                if (isAuthorizedToAccessEntity) { // Emit only if access has been granted
                    spark.emit(`entity:${doc.entityId}:${namespace}:${event}`, doc);
                }
            });
        // We do not have to worry about error or exception handling here. If
        // authorization is unable to be granted, we will not emit our event.
    };
}

function removeListener(event, listener) {
    return function () {
        EntityPermissionEvents.removeListener(event, listener);
    };
}
