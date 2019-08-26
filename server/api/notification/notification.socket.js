/**
 * Broadcast updates to client when the model changes
 */

import NotificationEvents from './notification.events';

// Model events to emit
var events = ['save', 'remove'];

export function register(spark) {
    // Bind model events to socket events
    for (let event of events) {
        var listener = createListener(`notification:${event}`, spark);

        NotificationEvents.on(event, listener);
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
        NotificationEvents.removeListener(event, listener);
    };
}
