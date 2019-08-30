/**
 * Notification model events
 */

import { EventEmitter } from 'events';
var NotificationEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
NotificationEvents.setMaxListeners(0);

// Model events
var events = {
    save: 'save',
    remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Notification) {
    for (var e in events) {
        let event = events[e];
        Notification.post(e, emitEvent(event));
    }
}

function emitEvent(event) {
    return function (doc) {
        NotificationEvents.emit(`${event}:${doc._id}`, doc);
        NotificationEvents.emit(event, doc);
    };
}

export { registerEvents };
export default NotificationEvents;
