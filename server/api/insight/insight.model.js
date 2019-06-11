import mongoose from 'mongoose';
import {
    registerEvents
} from './insight.events';

var InsightSchema = new mongoose.Schema({
    name: String,
    description: {
        type: String
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

registerEvents(InsightSchema);
export default mongoose.model('Insight', InsightSchema);
