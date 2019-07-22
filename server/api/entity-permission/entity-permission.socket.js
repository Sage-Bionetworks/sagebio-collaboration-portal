/**
 * Broadcast updates to client when the model changes
 */

import EntityPermissionEvents from './entity-permission.events';
import config from '../../config/environment';
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
        // WIP #252 - VERIFY once unblocked from current work-in-progress in #253
        console.log(`entity-permission createListener doc: ${JSON.stringify(doc, null, 2)}`);
        /*
            entity-permission createListener doc: {
            "status": "pending",
            "_id": "5d360d45f75dd54964f87b29",
            "entityId": "5cb7acea2d718654d81bb97e",
            "entityType": "project",
            "user": {
                "role": "user",
                "_id": "5cb7acea2d718614d81cc97e",
                "name": "Test User",
                "username": "test"
            },
            "access": "read",
            "createdBy": "5cb7acea2d718614d81bb97f",
            "createdAt": "2019-07-22T19:23:49.998Z",
            "__v": 0
            }
        */
        const userRole = doc.user.role || '';
        const userId = doc.user._id || '';
        const requestedPermission = 'admin';
        const entityId = doc.entityId || '';

        // WIP #252 - Remove this IF block when new code is in place
        // if (isAuthorized(doc, spark.userId)) {
        //     spark.emit(event, doc);
        // }

        // WIP #252 - Use new method to authorize socket to emit an event if the user is an admin role OR authorized for the entity
        // spark.emit(`${doc.entityType}:${doc.entityId}:${namespace}:${event}`, doc);

        // emit only if
        // - hasPermissionForEntity.admin
        try {
            hasAccessToEntity(userRole, userId, requestedPermission, entityId)
                .then(isGrantedAccess => {
                    const isAuthorizedToAccessEntity = isGrantedAccess;

                    if (isAuthorizedToAccessEntity) { // Continue processing request if access is granted
                        console.log(`${requestedPermission} PERMISSION GRANTED TO ENTITY ${entityId} FOR USER ${userId} WITH A ROLE OF ${userRole}`);
                        spark.emit(`entity:${doc.entityId}:${namespace}:${event}`, doc);
                    }

                    console.log(`!! ${requestedPermission} PERMISSION DENIED TO ENTITY ${entityId} FOR USER ${userId} WITH A ROLE OF ${userRole} !!`);
                })
                .catch(err => {
                    console.log(`!! ${requestedPermission} PERMISSION DENIED TO ENTITY ${entityId} FOR USER ${userId} WITH A ROLE OF ${userRole} !!`);
                });
        } catch (err) {
            console.log(`!! ${requestedPermission} PERMISSION DENIED TO ENTITY ${entityId} FOR USER ${userId} WITH A ROLE OF ${userRole} !!`);
        }

        // WIP #252 - Remove
        // if (hasAccessToEntity(userRole, userId, requestedPermission, entityId)) {
        //     console.log(`${requestedPermission} PERMISSION GRANTED TO ENTITY ${entityId} FOR USER ${userId} WITH A ROLE OF ${userRole}`);
        //     spark.emit(`entity:${doc.entityId}:${namespace}:${event}`, doc);
        // } else {
        //     console.log(`!! ${requestedPermission} PERMISSION DENIED TO ENTITY ${entityId} FOR USER ${userId} WITH A ROLE OF ${userRole} !!`);
        // }
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
