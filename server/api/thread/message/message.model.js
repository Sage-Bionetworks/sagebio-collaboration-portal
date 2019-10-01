import mongoose from 'mongoose';
import { registerEvents } from './message.events';
import User from '../../user/user.model';
import { models as modelSpecs } from '../../../config/environment';

var MessageSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true,
        minlength: modelSpecs.message.body.minlength,
        maxlength: modelSpecs.message.body.maxlength,
    },
    thread: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Thread',
    },
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
    // .execPopulate();
};

MessageSchema.pre('find', autoPopulatePre);
MessageSchema.post('save', doc => autoPopulatePost(doc).execPopulate());

// registerEvents(MessageSchema, autoPopulatePost);
export default mongoose.model('Message', MessageSchema);
