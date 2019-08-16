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

const autoPopulatePre = function (next) {
    this
        .populate('createdBy', User.profileProperties);
    next();
};

ResourceSchema
    .pre('find', autoPopulatePre);

registerEvents(ResourceSchema);
export default mongoose.model('Resource', ResourceSchema);
