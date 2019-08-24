import mongoose from 'mongoose';
import { registerEvents } from '../notification.events';
import User from '../../user/user.model';
import config from '../../../config/environment';

const options = {
    discriminatorKey: 'notificationType',
    collection: 'notifications',
};


var NotificationSchema = new mongoose.Schema({
    notificationType: {
        type: String,
        enum: Object.values(config.notificationTypes).map(notification => notification.value),
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    archived: {
        type: Boolean,
        default: false,
    },
    __v: {
        type: Number,
        select: false,
    },
}, options);

/**
 * Middlewares
 */

const autoPopulatePost = function (doc) {
    return doc
        .populate('user', User.profileProperties)
        .populate('createdBy', User.profileProperties)
        .execPopulate();
};

NotificationSchema.post('save', autoPopulatePost);

registerEvents(NotificationSchema);
export default mongoose.model('Notification', NotificationSchema);
