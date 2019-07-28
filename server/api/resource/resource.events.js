/**
 * Resource model events
 */

import {
    EventEmitter
} from 'events';
var ResourceEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ResourceEvents.setMaxListeners(0);

// Model events
var events = {
    save: 'save',
    remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Resource) {
    for (var e in events) {
        let event = events[e];
        Resource.post(e, emitEvent(event));
    }
}

function emitEvent(event) {
    return doc => {
        ResourceEvents.emit(`${event}:${doc._id}`, doc);
        ResourceEvents.emit(event, doc);
    };
}

export {
    registerEvents
};
export default ResourceEvents;
