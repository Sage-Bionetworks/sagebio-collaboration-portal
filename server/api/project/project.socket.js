/**
 * Broadcast updates to client when the model changes
 */

import ProjectEvents from './project.events';

// Model events to emit
var events = ['save', 'remove'];

export function register(spark) {
    // Bind model events to socket events
    for(let event of events) {
        var listener = createListener(`project:${event}`, spark);

        ProjectEvents.on(event, listener);
        spark.on('disconnect', removeListener(event, listener));
    }
}


function createListener(event, spark) {
    return function(doc) {
        spark.emit(event, doc);
    };
}

function removeListener(event, listener) {
    return function() {
        ProjectEvents.removeListener(event, listener);
    };
}
