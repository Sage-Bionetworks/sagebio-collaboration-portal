/**
 * Permission model events
 */

import {EventEmitter} from 'events';
var PermissionEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
PermissionEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Permission) {
  for(var e in events) {
    let event = events[e];
    Permission.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    PermissionEvents.emit(event + ':' + doc._id, doc);
    PermissionEvents.emit(event, doc);
  };
}

export {registerEvents};
export default PermissionEvents;
