import mongoose from 'mongoose';
import {
    registerEvents
} from '../resource.events';
import User from '../../user/user.model';
import config from '../../../config/environment';

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
    visibility: {
        type: String,
        required: true,
        enum: Object.values(config.entityVisibility).map(visibility => visibility.value),
        default: config.models.resource.visibility.default
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

ResourceSchema.index({ title: 'text' }, { weights: { title: 1 }});

registerEvents(ResourceSchema);
export default mongoose.model('Resource', ResourceSchema);
