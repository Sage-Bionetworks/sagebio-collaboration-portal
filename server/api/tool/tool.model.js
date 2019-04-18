import mongoose from 'mongoose';
import {
    registerEvents
} from './tool.events';

var ToolSchema = new mongoose.Schema({
    _id: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    picture: String,
    apiServerUrl: String,
    resourceFormats: [{
        type: String
    }],
    website: String,
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        // required: true
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
});

registerEvents(ToolSchema);
export default mongoose.model('Tool', ToolSchema);
