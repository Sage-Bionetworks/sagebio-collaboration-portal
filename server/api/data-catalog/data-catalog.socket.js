/**
 * Broadcast updates to client when the model changes
 */

import DataCatalogEvents from './data-catalog.events';

// Model events to emit
var events = ['save', 'remove'];

export function register(spark) {
    // Bind model events to socket events
    for(let event of events) {
        var listener = createListener(`dataCatalog:${event}`, spark);

        DataCatalogEvents.on(event, listener);
        spark.on('disconnect', removeListener(event, listener));
    }
}


function createListener(event, spark) {
    return function(doc) {
        spark.emit(event, doc);
    };
}

function removeListener(event, listener) {
    return function() {
        DataCatalogEvents.removeListener(event, listener);
    };
}
