/**
 * Broadcast updates to client when the model changes
 */

import DatasetEvents from './dataset.events';

// Model events to emit
var events = ['save', 'remove'];

export function register(spark) {
    // Bind model events to socket events
    for (let event of events) {
        var listener = createListener(`dataset:${event}`, spark);

        DatasetEvents.on(event, listener);
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
        DatasetEvents.removeListener(event, listener);
    };
}
