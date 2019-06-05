/**
 * Broadcast updates to client when the model changes
 */

import StarredMessageEvents from './starred-message.events';

// Model events to emit
var events = ['save', 'remove'];

export function register(spark) {
    // Bind model events to socket events
    for (let event of events) {
        var listener = createListener(`starredMessage:${event}`, spark);

        StarredMessageEvents.on(event, listener);
        spark.on('disconnect', removeListener(event, listener));
    }
}


function createListener(event, spark) {
    return function (doc) {
        console.log('testing if can emit star save', doc);
        if (isAuthorized(doc, spark.userId)) {
            spark.emit(event, doc);
        }
    };
}

function removeListener(event, listener) {
    return function () {
        StarredMessageEvents.removeListener(event, listener);
    };
}

// Returns true if the user specified is the user who starred the message.
function isAuthorized(doc, userId) {
    return userId ? doc.starredBy == userId : false;
}
