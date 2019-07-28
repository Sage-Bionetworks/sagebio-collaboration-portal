import mongoose from 'mongoose';
import {
    registerEvents
} from '../resource.events';

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

registerEvents(ResourceSchema);
export default mongoose.model('Resource', ResourceSchema);
