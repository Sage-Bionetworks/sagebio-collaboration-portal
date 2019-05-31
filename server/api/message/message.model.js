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
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag'
    }],
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
});

/**
 * Middlewares
 */
const autoPopulatePre = function (next) {
    this
        .populate('createdBy', User.profileProperties)
        .populate('tags');
    next();
};

const updateUpdatedAt = function (next) {
    this.updatedAt = Date.now();
    next();
};

const autoPopulatePost = function (doc) {
    return doc
        .populate('createdBy', User.profileProperties)
        .populate('tags')
        .execPopulate();
};

// MessageSchema.pre('save', function (next) {
//     this.updatedAt = Date.now();
//     next();
// });

MessageSchema
    .pre('find', autoPopulatePre)
    .pre('findById', autoPopulatePre)
    .pre('save', updateUpdatedAt);

MessageSchema
    .post('save', autoPopulatePost);

registerEvents(MessageSchema);
export default mongoose.model('Message', MessageSchema);
