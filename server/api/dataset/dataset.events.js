/**
 * Dataset model events
 */

import {
    EventEmitter
} from 'events';
var DatasetEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
DatasetEvents.setMaxListeners(0);

// Model events
var events = {
    save: 'save',
    remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Dataset) {
    for (var e in events) {
        let event = events[e];
        Dataset.post(e, emitEvent(event));
    }
}

function emitEvent(event) {
    return doc => {
        DatasetEvents.emit(`${event}:${doc._id}`, doc);
        DatasetEvents.emit(event, doc);
    };
}

export {
    registerEvents
};
export default DatasetEvents;
