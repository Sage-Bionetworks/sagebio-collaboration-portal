import mongoose from 'mongoose';
import {
    registerEvents
} from './tag.events';

var TagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    __v: {
        type: Number,
        select: false
    }
});

registerEvents(TagSchema);
export default mongoose.model('Tag', TagSchema);
