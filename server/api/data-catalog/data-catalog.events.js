/**
 * DataCatalog model events
 */

import {EventEmitter} from 'events';
var DataCatalogEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
DataCatalogEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(DataCatalog) {
  for(var e in events) {
    let event = events[e];
    DataCatalog.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    DataCatalogEvents.emit(event + ':' + doc._id, doc);
    DataCatalogEvents.emit(event, doc);
  };
}

export {registerEvents};
export default DataCatalogEvents;
