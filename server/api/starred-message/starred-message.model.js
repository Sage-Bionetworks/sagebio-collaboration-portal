import mongoose from 'mongoose';
import {
    registerEvents
} from './starred-message.events';

var StarredMessageSchema = new mongoose.Schema({
    message: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    starredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    archived: {
        type: Boolean,
        default: false
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
});

StarredMessageSchema.index({ message: 1, starredBy: 1}, { unique: true });
registerEvents(StarredMessageSchema);
export default mongoose.model('StarredMessage', StarredMessageSchema);
