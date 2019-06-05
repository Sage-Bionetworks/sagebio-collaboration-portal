import mongoose from 'mongoose';
import {
    registerEvents
} from './message.events';
import User from '../user/user.model';

const messageOptions = {
    discriminatorKey: 'messageType',
    collection: 'messages'
};

var BaseMessageSchema = new mongoose.Schema({
    body: {
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
        ref: 'User'
    },
    __v: {
        type: Number,
        select: false
    }
}, messageOptions);

const autoPopulatePre = function (next) {
    this
        .populate('createdBy', User.profileProperties);
        // .populate('tags');
    next();
};

const updateUpdatedAt = function (next) {
    this.updatedAt = Date.now();
    next();
};

const autoPopulatePost = function (doc) {
    return doc
        .populate('createdBy', User.profileProperties)
        // .populate('tags')
        .execPopulate();
};

BaseMessageSchema
    .pre('find', autoPopulatePre)
    .pre('save', updateUpdatedAt);

BaseMessageSchema
    .post('save', autoPopulatePost);

registerEvents(BaseMessageSchema);
export default mongoose.model('BaseMessage', BaseMessageSchema, 'messages');
