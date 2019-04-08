/**
 * Tool model events
 */

import {EventEmitter} from 'events';
var ToolEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ToolEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Tool) {
  for(var e in events) {
    let event = events[e];
    Tool.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    ToolEvents.emit(event + ':' + doc._id, doc);
    ToolEvents.emit(event, doc);
  };
}

export {registerEvents};
export default ToolEvents;
