/**
 * Broadcast updates to client when the model changes
 */

import ProjectEvents from './project.events';
import { hasAccessToEntity } from '../../auth/auth';
import config from '../../config/environment';

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
        hasAccessToEntity(
            spark.userId,
            [config.accessTypes.READ.value, config.accessTypes.WRITE.value, config.accessTypes.ADMIN.value],
            doc._id,
            [
                // TODO Rename inviteStatusTypes (do not use invite)
                config.inviteStatusTypes.ACCEPTED.value,
            ]
        )
            .then(hasAccess => {
                if (hasAccess) {
                    spark.emit(`${modelName}:${doc._id}:${event}`, doc);
                }
            })
            .catch(err => {
                console.error(err);
            });

        // if (isAuthorized(doc, spark.userId)) {
            // spark.emit(`${namespace}:${event}`, doc);
            // captured by project data service
            // TODO: protect must be able to admin project
            // spark.emit(`${namespace}:${doc._id}:${event}`, doc);
        // }
    };
}

function removeListener(event, listener) {
    return function () {
        ProjectEvents.removeListener(event, listener);
    };
}

// function isAuthorized(doc, userId) {
//     return userId && doc.user._id == userId; // seems to work even if doc.user is not populated...
// }
