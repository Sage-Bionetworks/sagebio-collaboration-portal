/**
 * Broadcast updates to client when the model changes
 */

import ProjectEvents from './project.events';

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


function createListener(namespace, event, spark) {
    return function (doc) {
        // if (isAuthorized(doc, spark.userId)) {
            spark.emit(`${namespace}:${event}`, doc);
            // captured by project data service
            // TODO: protect must be able to admin project
            spark.emit(`${namespace}:${doc._id}:${event}`, doc);
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
