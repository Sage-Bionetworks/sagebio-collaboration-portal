import mongoose from 'mongoose';
import {
    registerEvents
} from './state.events';

var StateSchema = new mongoose.Schema({
    name: String,
    data: String,
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
