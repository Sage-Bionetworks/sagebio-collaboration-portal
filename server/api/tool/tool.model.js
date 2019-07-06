import mongoose from 'mongoose';
import {
    registerEvents
} from './tool.events';

var ToolSchema = new mongoose.Schema({
    slug: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        default: 'https://via.placeholder.com/200x200'
    },
    website: {
        type: String,
        required: true
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    apiServerUrl: {
        type: String,
        required: true
    },
    apiHealthCheckUrl : {
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
        ref: 'User'
    },
    __v: {
        type: Number,
        select: false
    }
});

registerEvents(ToolSchema);
export default mongoose.model('Tool', ToolSchema);
