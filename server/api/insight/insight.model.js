import mongoose from 'mongoose';
import {
    registerEvents
} from './insight.events';

var InsightSchema = new mongoose.Schema({
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

registerEvents(InsightSchema);
export default mongoose.model('Insight', InsightSchema);
