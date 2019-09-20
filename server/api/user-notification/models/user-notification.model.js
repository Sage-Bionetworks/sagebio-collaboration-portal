import mongoose from 'mongoose';
import { registerEvents } from '../user-notification.events';
import User from '../../user/user.model';
import { userNotificationTypes } from '../../../config/environment';

const options = {
    discriminatorKey: 'userNotificationType',
    collection: 'user-notifications',
};

var UserNotificationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        archived: {
            type: Boolean,
            default: false,
        },
        userNotificationType: {
            type: String,
            enum: Object.values(userNotificationTypes).map(notification => notification.value),
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
        __v: {
            type: Number,
            select: false,
        },
    },
    options
);

/**
 * Middlewares
 */

const autoPopulatePre = function (next) {
    // eslint-disable-next-line no-invalid-this
    this.populate('user', User.profile).populate('createdBy', User.profile);
    next();
};

const autoPopulatePost = function (doc) {
    return doc
        .populate('user', User.profile)
        .populate('createdBy', User.profile)
        .execPopulate();
};

UserNotificationSchema.pre('find', autoPopulatePre);
UserNotificationSchema.post('save', autoPopulatePost);

registerEvents(UserNotificationSchema);
export default mongoose.model('UserNotification', UserNotificationSchema);
