/**
 * Provenance model events
 */

import {EventEmitter} from 'events';
var ProvenanceEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ProvenanceEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Provenance) {
  for(var e in events) {
    let event = events[e];
    Provenance.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    ProvenanceEvents.emit(event + ':' + doc._id, doc);
    ProvenanceEvents.emit(event, doc);
  };
}

export {registerEvents};
export default ProvenanceEvents;
