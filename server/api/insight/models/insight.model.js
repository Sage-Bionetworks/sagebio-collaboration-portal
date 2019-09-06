import mongoose from 'mongoose';
import { registerEvents } from '../insight.events';
import User from '../../user/user.model';
import config from '../../../config/environment';

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
    visibility: {
        type: String,
        required: true,
        enum: Object.values(config.entityVisibility).map(visibility => visibility.value),
        default: config.models.insight.visibility.default
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
    attachments: {
        type: Object,
        ref: 'EntityAttachments',
    },
}, options);

/**
 * Middlewares
 */

const autoPopulatePre = function (next) {
    // eslint-disable-next-line no-invalid-this
    this.populate('createdBy', User.profileProperties);
    next();
};

const autoPopulatePost = function (doc) {
    return doc.populate('createdBy', User.profileProperties).execPopulate();
};

InsightSchema.pre('find', autoPopulatePre);
InsightSchema.pre('findOne', autoPopulatePre);
InsightSchema.post('save', autoPopulatePost);

InsightSchema.index({ title: 'text' }, { weights: { title: 1 } });

registerEvents(InsightSchema);
export default mongoose.model('Insight', InsightSchema);
