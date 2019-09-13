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
        // TODO Set authorization
        Thread.findById(doc.thread)
            .exec()
            .then(thread =>
                // hasAccessToEntity(spark.userId, [
        //             config.accessTypes.READ.value,
        //             config.accessTypes.WRITE.value,
        //             config.accessTypes.ADMIN.value
        //         ], thread.entityId, [
        //             config.inviteStatusTypes.ACCEPTED.value
        //         ])
        //         .then(hasAccess => {
        //             if (hasAccess) {
                        spark.emit(`${modelName}:entity:${thread.entityId}:${thread._id}:${event}`, doc)
    //                 }
    //             })
            )
            .catch(err => {
                console.error(err);
            });
    };
}

function removeListener(event, listener) {
    return function () {
        MessageEvents.removeListener(event, listener);
    };
}
