/**
 * Broadcast updates to client when the model changes
 */

import ThreadEvents from './thread.events';

// Model events to emit
var events = ['save', 'remove'];

export function register(spark) {
    // Bind model events to socket events
    for (let event of events) {
        var listener = createListener(`thread:${event}`, spark);

        ThreadEvents.on(event, listener);
        spark.on('disconnect', removeListener(event, listener));
    }
}


function createListener(event, spark) {
    return function (doc) {
        if (doc.thread) {
            spark.emit(`thread:${doc.thread}:${event}`, doc);
        } else {
            spark.emit(event, doc);
        }
    };
}

function removeListener(event, listener) {
    return function () {
        ThreadEvents.removeListener(event, listener);
    };
}
