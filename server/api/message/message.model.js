import mongoose from 'mongoose';
import {
    registerEvents
} from './message.events';
import BaseMessage from './base-message.model';

var MessageSchema = new mongoose.Schema({
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag'
    }]
});

/**
 * Virtuals
 */

// Whether the current user has starred the message.
// MessageSchema
//     .virtual('starred')
//     .get(() => {
//
//     });

// MessageSchema.set('toObject', { getters: true });
// MessageSchema.set('toJSON', { getters: true });

/**
 * Middlewares
 */

const autoPopulatePre = function (next) {
    this
        // .populate('createdBy', User.profileProperties)
        .populate('tags');
    next();
};
//
// const updateUpdatedAt = function (next) {
//     this.updatedAt = Date.now();
//     next();
// };

const autoPopulatePost = function (doc) {
    return doc
        // .populate('createdBy', User.profileProperties)
        .populate('tags')
        .execPopulate();
};

// MessageSchema.pre('save', function (next) {
//     this.updatedAt = Date.now();
//     next();
// });

MessageSchema
    .pre('find', autoPopulatePre);
    // .pre('save', updateUpdatedAt);

MessageSchema
    .post('save', autoPopulatePost);

registerEvents(MessageSchema);
export default BaseMessage.discriminator('Message', MessageSchema);
// export default mongoose.model('Message', MessageSchema);
