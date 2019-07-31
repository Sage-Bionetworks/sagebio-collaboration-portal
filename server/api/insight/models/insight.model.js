import mongoose from 'mongoose';
import {
    registerEvents
} from '../insight.events';
import User from '../../user/user.model';

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

/**
 * Middlewares
 */

const autoPopulatePre = function (next) {
    this
        .populate('createdBy', User.profileProperties)
    next();
};

InsightSchema
    .pre('find', autoPopulatePre);

registerEvents(InsightSchema);
export default mongoose.model('Insight', InsightSchema);
