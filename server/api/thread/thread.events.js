/**
 * Thread model events
 */

import {
    EventEmitter
} from 'events';
var ThreadEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ThreadEvents.setMaxListeners(0);

// Model events
var events = {
    save: 'save',
    remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Thread) {
    for (var e in events) {
        let event = events[e];
        Thread.post(e, emitEvent(event));
    }
}

function emitEvent(event) {
    return function (doc) {
        ThreadEvents.emit(event, doc);
    };
}

export {
    registerEvents
};
export default ThreadEvents;
