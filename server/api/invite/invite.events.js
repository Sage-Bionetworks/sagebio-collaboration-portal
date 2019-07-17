/**
 * Invite model events
 */

import {EventEmitter} from 'events';
var InviteEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
InviteEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Invite) {
  for(var e in events) {
    let event = events[e];
    Invite.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    InviteEvents.emit(event + ':' + doc._id, doc);
    InviteEvents.emit(event, doc);
  };
}

export {registerEvents};
export default InviteEvents;
