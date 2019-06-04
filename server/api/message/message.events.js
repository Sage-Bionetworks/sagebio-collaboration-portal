/**
 * Message model events
 */

import {
    EventEmitter
} from 'events';
var MessageEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
MessageEvents.setMaxListeners(0);

// Model events
var events = {
    save: 'save',
    remove: 'remove',
    deleteMany: 'deleteMany'
};

// Register the event emitter to the model events
function registerEvents(Message) {
    for (var e in events) {
        let event = events[e];
        Message.post(e, emitEvent(event));
    }
}

function emitEvent(event) {
    return function (doc) {
        console.log('doc', doc);
        console.log(`${event}:${doc._id}`);
        MessageEvents.emit(`${event}:${doc._id}`, doc);
        MessageEvents.emit(event, doc);
    };
}

export {
    registerEvents
};
export default MessageEvents;
