import mongoose from 'mongoose';
import User from '../user/user.model';
import {
    registerEvents
} from './tool.events';
import { models as modelSpecs } from '../../config/environment';

var ToolSchema = new mongoose.Schema({
    // slug: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        default: modelSpecs.tool.picture.default
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    website: {
        type: String,
        required: true
    },
    visibility: {
        type: String,
        required: true,
        enum: modelSpecs.tool.visibility.options.map(visibility => visibility.value),
        default: modelSpecs.tool.visibility.default.value,
    },
    // apiServerUrl: {
    //     type: String,
    //     required: true
    // },
    apiHealthCheckUrl: {
        type: String,
        required: true
    },
    resourceFormats: [{
        type: String
    }],
    createdAt: {
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
 * Middlewares
 */

const autoPopulatePre = function (next) {
    // eslint-disable-next-line no-invalid-this
    this
        .populate('createdBy', User.profileProperties)
        .populate('organization');
    next();
};

const autoPopulatePost = function (doc) {
    return doc
        .populate('createdBy', User.profileProperties)
        .populate('organization')
        .execPopulate();
};

ToolSchema.pre('find', autoPopulatePre);
ToolSchema.pre('findOne', autoPopulatePre);
ToolSchema.post('save', autoPopulatePost);

ToolSchema.index({ title: 'text' }, { weights: { title: 1 }});

registerEvents(ToolSchema);
export default mongoose.model('Tool', ToolSchema);
