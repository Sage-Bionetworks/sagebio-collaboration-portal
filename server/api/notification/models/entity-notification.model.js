import mongoose from 'mongoose';
import Notification from './notification.model';
import Insight from '../../insight/models/insight.model';
import config from '../../../config/environment';

var EntityNotificationSchema = new mongoose.Schema({
    entityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    entityType: {
        type: String,
        enum: Object.values(config.entityTypes).map(type => type.value),
        required: true,
    },
});

/**
 * Middlewares
 */

// const autoPopulatePre = function (next) {
//     return doc
//         .populate('entityId', Insight)
//         .execPopulate();
// };

// EntityNotificationSchema.pre('find', autoPopulatePre);
export default Notification.discriminator('EntityNotification', EntityNotificationSchema);
