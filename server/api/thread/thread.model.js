import mongoose from 'mongoose';
import {
    registerEvents
} from './thread.events';
import User from '../user/user.model';

var ThreadSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    entityId: {
        type: String,
        required: true
    },
    entityType: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    __v: {
        type: Number,
        select: false
    }
});

/**
 * Virtuals
 */

// Whether the current user has starred the message.
// ThreadSchema
//     .virtual('starred')
//     .get(() => {
//
//     });

// ThreadSchema.set('toObject', { getters: true });
// ThreadSchema.set('toJSON', { getters: true });

/**
 * Middlewares
 */

const autoPopulatePre = function (next) {
    this
        .populate('createdBy', User.profileProperties)
    // .populate('tags');
    next();
};
//
// const updateUpdatedAt = function (next) {
//     this.updatedAt = Date.now();
//     next();
// };

const autoPopulatePost = function (doc) {
    return doc
        .populate('createdBy', User.profileProperties)
        // .populate('tags')
        .execPopulate();
};

// ThreadSchema.pre('save', function (next) {
//     this.updatedAt = Date.now();
//     next();
// });

ThreadSchema
    .pre('find', autoPopulatePre);
// .pre('save', updateUpdatedAt);

ThreadSchema
    .post('save', autoPopulatePost);

registerEvents(ThreadSchema);

var Thread = mongoose.model('Thread', ThreadSchema);
// For now, we want to return all of the properties of our thread if we are populating references
Thread.threadProperties = '_id title entityId entityType createdAt updatedAt createdBy';

export default Thread;
