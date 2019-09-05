import mongoose from 'mongoose';
import { registerEvents } from '../insight.events';
import User from '../../user/user.model';
import { models as modelSpecs } from '../../../config/environment';
import EntityAttachment from '../../attachments/entity-attachment.schema';

const options = {
    discriminatorKey: 'insightType',
    collection: 'insights',
};

var InsightSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            minlength: modelSpecs.insight.title.minlength,
            maxlength: modelSpecs.insight.title.maxlength
        },
        description: {
            type: String,
            required: true,
            minlength: modelSpecs.insight.description.minlength,
            maxlength: modelSpecs.insight.description.maxlength
        },
        picture: {
            type: String,
            default: modelSpecs.insight.picture.default,
        },
        visibility: {
            type: String,
            required: true,
            enum: modelSpecs.insight.visibility.options.map(visibility => visibility.value),
            default: modelSpecs.insight.visibility.default.value,
        },
        projectId: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        attachments: [EntityAttachment],
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
