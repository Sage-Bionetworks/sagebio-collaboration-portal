import mongoose from 'mongoose';
import {
    registerEvents
} from './message.events';

var MessageSchema = new mongoose.Schema({
    slug: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag'
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

registerEvents(MessageSchema);
export default mongoose.model('Message', MessageSchema);
