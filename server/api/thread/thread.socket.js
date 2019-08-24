/**
 * Broadcast updates to client when the model changes
 */

import {
    hasAccessToEntity,
} from '../../auth/auth';
import config from '../../config/environment';
import ThreadEvents from './thread.events';

// Model events to emit
var events = ['save', 'remove'];

export function register(spark) {
    // Bind model events to socket events
    for (let event of events) {
        var listener = createListener('thread', event, spark);

        ThreadEvents.on(event, listener);
        spark.on('disconnect', removeListener(event, listener));
    }
}

function createListener(namespace, event, spark) {
    return function (doc) {
        // console.log(`Firing ${namespace}:entity:${doc.entityId}:${event}`);
        hasAccessToEntity(spark.userId, [
                config.accessTypes.READ.value,
                config.accessTypes.WRITE.value,
                config.accessTypes.ADMIN.value
            ], doc.entityId, [
                // TODO Rename inviteStatusTypes (do not use invite)
                config.inviteStatusTypes.ACCEPTED.value
            ])
            .then(hasAccess => {
                if (hasAccess) {
                    // spark.emit(`${namespace}:${event}`, doc);
                    spark.emit(`${namespace}:entity:${doc.entityId}:${event}`, doc);
                }
            })
            .catch(err => {
                console.error(err);
            });
    };
}

function removeListener(event, listener) {
    return function () {
        ThreadEvents.removeListener(event, listener);
    };
}
