import mongoose from 'mongoose';
import {
    registerEvents
} from '../insight.events';

const options = {
    discriminatorKey: 'insightType',
    collection: 'insights',
};

var InsightSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
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

registerEvents(InsightSchema);
export default mongoose.model('Insight', InsightSchema);
