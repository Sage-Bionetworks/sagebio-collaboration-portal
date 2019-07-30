import mongoose from 'mongoose';
import {
    registerEvents
} from './thread.events';
import User from '../user/user.model';

// WIP #49 - Create the back-end Thread model
var ThreadSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true
    },
    thread: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Thread'
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
export default mongoose.model('Thread', ThreadSchema);
