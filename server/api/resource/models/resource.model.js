import mongoose from 'mongoose';
import {
    registerEvents
} from '../resource.events';
import User from '../../user/user.model';
import { models as modelSpecs } from '../../../config/environment';

const options = {
    discriminatorKey: 'resourceType',
    collection: 'resources',
};

var ResourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: modelSpecs.resource.title.minlength,
        maxlength: modelSpecs.resource.title.maxlength
    },
    description: {
        type: String,
        required: true,
        minlength: modelSpecs.resource.description.minlength,
        maxlength: modelSpecs.resource.description.maxlength
    },
    picture: {
        type: String,
        default: modelSpecs.resource.picture.default
    },
    visibility: {
        type: String,
        required: true,
        enum: modelSpecs.resource.visibility.options.map(visibility => visibility.value),
        default: modelSpecs.resource.visibility.default.value,
    },
    url: {
        type: String,
        required: false,
        minlength: modelSpecs.resource.url.minlength,
        maxlength: modelSpecs.resource.url.maxlength
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

ResourceSchema.index({ title: 'text' }, { weights: { title: 1 }});

registerEvents(ResourceSchema);
export default mongoose.model('Resource', ResourceSchema);
