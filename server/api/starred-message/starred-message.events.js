/**
 * StarredMessage model events
 */

import {
    EventEmitter
} from 'events';
var StarredMessageEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
StarredMessageEvents.setMaxListeners(0);

// Model events
var events = {
    save: 'save',
    remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(StarredMessage) {
    for (var e in events) {
        let event = events[e];
        console.log('registering event stars', e);
        StarredMessage.post(e, emitEvent(event));
    }
}

function emitEvent(event) {
    return function (doc) {
        StarredMessageEvents.emit(`${event}:${doc._id}`, doc);
        StarredMessageEvents.emit(event, doc);
    };
}

export {
    registerEvents
};
export default StarredMessageEvents;
