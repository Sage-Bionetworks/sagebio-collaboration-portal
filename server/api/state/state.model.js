import mongoose from 'mongoose';
import {
    registerEvents
} from './state.events';

var StateSchema = new mongoose.Schema({
    _id: {
        type: String
    },
    name: String,
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

registerEvents(StateSchema);
export default mongoose.model('State', StateSchema);
