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
    image: String,
    apiBaseUri: String,
    website: String,
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
