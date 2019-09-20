/**
 * Broadcast updates to client when the model changes
 */

import ThreadEvents from './thread.events';
import { hasAccessToEntity } from '../../auth/auth';
import config from '../../config/environment';

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

function createListener(modelName, event, spark) {
    return function (doc) {
        // TODO set authorization
        // console.log(`Firing ${modelName}:entity:${doc.entityId}:${event}`);
        // hasAccessToEntity(
        //     spark.userId,
        //     [config.accessTypes.READ.value, config.accessTypes.WRITE.value, config.accessTypes.ADMIN.value],
        //     doc.entityId,
        //     [
        //         // TODO Rename inviteStatusTypes (do not use invite)
        //         config.inviteStatusTypes.ACCEPTED.value,
        //     ]
        // )
        //     .then(hasAccess => {
        //         if (hasAccess) {
                    // spark.emit(`${modelName}:${event}`, doc);
                    spark.emit(`${modelName}:entity:${doc.entityId}:${event}`, doc);
            //     }
            // })
            // .catch(err => {
            //     console.error(err);
            // });
    };
}

function removeListener(event, listener) {
    return function () {
        ThreadEvents.removeListener(event, listener);
    };
}
