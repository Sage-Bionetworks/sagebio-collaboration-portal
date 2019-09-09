import mongoose from 'mongoose';
import { registerEvents } from './thread.events';
import User from '../user/user.model';

var ThreadSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    entityId: {
        type: String,
        required: true,
    },
    entityType: {
        type: String,
        required: true,
    },
    contributors: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    __v: {
        type: Number,
        select: false,
    },
});

/**
 * Middlewares
 */

const autoPopulatePre = function (next) {
    // eslint-disable-next-line no-invalid-this
    this.populate('createdBy', User.profileProperties)
        .populate('updatedBy', User.profileProperties)
        .populate('contributors', User.profileProperties);
    next();
};
const autoPopulatePost = function (doc) {
    return doc
        .populate('createdBy', User.profileProperties)
        .populate('updatedBy', User.profileProperties)
        .populate('contributors', User.profileProperties)
        .execPopulate();
};

ThreadSchema.pre('find', autoPopulatePre);
ThreadSchema.pre('findOne', autoPopulatePre);
ThreadSchema.post('save', autoPopulatePost);

registerEvents(ThreadSchema);
export default mongoose.model('Thread', ThreadSchema);
