/**
 * EntityPermission model events
 */

import { EventEmitter } from 'events';
var EntityPermissionEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
EntityPermissionEvents.setMaxListeners(0);

// Model events
var events = {
    save: 'save',
    remove: 'remove',
};

// Register the event emitter to the model events
function registerEvents(EntityPermission) {
    for (var e in events) {
        let event = events[e];
        EntityPermission.post(e, emitEvent(event));
    }
}

function emitEvent(event) {
    return function (doc) {
        EntityPermissionEvents.emit(`${event}:${doc._id}`, doc);
        EntityPermissionEvents.emit(event, doc);
    };
}

export { registerEvents };
export default EntityPermissionEvents;
