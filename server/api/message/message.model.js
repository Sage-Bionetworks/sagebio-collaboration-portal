import mongoose from 'mongoose';
import {
    registerEvents
} from './message.events';
import User from '../user/user.model';

var MessageSchema = new mongoose.Schema({
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
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    __v: {
        type: Number,
        select: false
    }
});

/**
 * Middlewares
 */

const autoPopulatePre = function (next) {
    this
        .populate('createdBy', User.profileProperties)
        .populate('updatedBy', User.profileProperties)
        .populate('thread');
    next();
};

const autoPopulatePost = function (doc) {
    return doc
        .populate('createdBy', User.profileProperties)
        .populate('updatedBy', User.profileProperties)
        .populate('thread');
};

MessageSchema.pre('find', autoPopulatePre);
MessageSchema.post('save', autoPopulatePost);

registerEvents(MessageSchema, autoPopulatePost);
export default mongoose.model('Message', MessageSchema);
