import mongoose from 'mongoose';
import {
    registerEvents
} from '../resource.events';
import User from '../../user/user.model';

const options = {
    discriminatorKey: 'resourceType',
    collection: 'resources',
};

var ResourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    url: {
        type: String,
        required: false
    },
    projectId: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }
}, options);

/**
 * Middlewares
 */

const autoPopulatePre = function (next) {
    // eslint-disable-next-line no-invalid-this
    this
        .populate('createdBy', User.profileProperties);
    next();
};

const autoPopulatePost = function (doc) {
    return doc
        .populate('createdBy', User.profileProperties)
        .execPopulate();
};

ResourceSchema.pre('find', autoPopulatePre);
ResourceSchema.pre('findOne', autoPopulatePre);
ResourceSchema.post('save', autoPopulatePost);

registerEvents(ResourceSchema);
export default mongoose.model('Resource', ResourceSchema);
