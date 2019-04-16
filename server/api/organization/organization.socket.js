/**
 * Broadcast updates to client when the model changes
 */

import OrganizationEvents from './organization.events';

// Model events to emit
var events = ['save', 'remove'];

export function register(spark) {
    // Bind model events to socket events
    for(let event of events) {
        var listener = createListener(`organization:${event}`, spark);

        OrganizationEvents.on(event, listener);
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
        OrganizationEvents.removeListener(event, listener);
    };
}
