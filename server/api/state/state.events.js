/**
 * State model events
 */

import {EventEmitter} from 'events';
var StateEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
StateEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(State) {
  for(var e in events) {
    let event = events[e];
    State.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    StateEvents.emit(event + ':' + doc._id, doc);
    StateEvents.emit(event, doc);
  };
}

export {registerEvents};
export default StateEvents;
