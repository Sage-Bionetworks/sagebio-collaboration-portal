/**
 * UserPermission model events
 */

import {EventEmitter} from 'events';
var UserPermissionEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
UserPermissionEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(UserPermission) {
  for(var e in events) {
    let event = events[e];
    UserPermission.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    UserPermissionEvents.emit(event + ':' + doc._id, doc);
    UserPermissionEvents.emit(event, doc);
  };
}

export {registerEvents};
export default UserPermissionEvents;
