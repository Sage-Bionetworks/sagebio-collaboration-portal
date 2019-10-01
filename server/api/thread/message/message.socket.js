/**
 * Broadcast updates to client when the model changes
 */

import {
    hasAccessToEntity,
} from '../../../auth/auth';
import MessageEvents from './message.events';
import Thread from '../thread.model';
import config from '../../../config/environment';

// Model events to emit
var events = ['save', 'remove'];

export function register(spark) {
    // Bind model events to socket events
    for (let event of events) {
        var listener = createListener('message', event, spark, spark);

        MessageEvents.on(event, listener);
        spark.on('disconnect', removeListener(event, listener));
    }
}

function createListener(modelName, event, spark) {
    return function (doc) {
        if (event === 'remove') { // TODO use enum
            console.log(`thread:${doc.thread}:messages:${event}`);
            spark.emit(`thread:${doc.thread}:messages:${event}`, doc);
        } else if (event === 'save') { // TODO use enum
            spark.emit(`thread:${doc.thread._id}:messages:${event}`, doc);
        }
    };
}

function removeListener(event, listener) {
    return function () {
        MessageEvents.removeListener(event, listener);
    };
}
