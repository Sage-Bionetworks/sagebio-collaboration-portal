/**
 * Broadcast updates to client when the model changes
 */

import ProjectEvents from './project.events';
import { canReadEntity } from '../../auth/auth';
import { entityTypes, accessTypes } from '../../config/environment';

// Model events to emit
var events = ['save', 'remove'];

export function register(spark) {
    // Bind model events to socket events
    for (let event of events) {
        var listener = createListener('project', event, spark);

        ProjectEvents.on(event, listener);
        spark.on('disconnect', removeListener(event, listener));
    }
}

function createListener(modelName, event, spark) {
    return function (doc) {
        canReadEntity(
            spark.userId,
            doc._id,
            entityTypes.PROJECT.value,
            doc.visibility,
            Object.values(accessTypes).map(access => access.value)
        )
            .then(hasAccess => {
                if (hasAccess) {
                    spark.emit(`${modelName}:${doc._id}:${event}`, doc);
                }
            })
            .catch(err => console.error(err));
    };
}

function removeListener(event, listener) {
    return function () {
        ProjectEvents.removeListener(event, listener);
    };
}
