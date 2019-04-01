/**
 * Insight model events
 */

import {EventEmitter} from 'events';
var InsightEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
InsightEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Insight) {
  for(var e in events) {
    let event = events[e];
    Insight.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    InsightEvents.emit(event + ':' + doc._id, doc);
    InsightEvents.emit(event, doc);
  };
}

export {registerEvents};
export default InsightEvents;
