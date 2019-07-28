/**
 * Broadcast updates to client when the model changes
 */

import ResourceEvents from './resource.events';

// Model events to emit
var events = ['save', 'remove'];

export function register(spark) {
    // Bind model events to socket events
    for (let event of events) {
        var listener = createListener(`resource:${event}`, spark);

        ResourceEvents.on(event, listener);
        spark.on('disconnect', removeListener(event, listener));
    }
}


function createListener(event, spark) {
    return doc => {
        spark.emit(event, doc);
    };
}

function removeListener(event, listener) {
    return () => {
        ResourceEvents.removeListener(event, listener);
    };
}
