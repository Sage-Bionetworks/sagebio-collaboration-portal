import mongoose from 'mongoose';
import UserNotification from './user-notification.model';

var EntityAccessUserNotificationSchema = new mongoose.Schema({
    entityPermissionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EntityPermission',
        required: true,
    },
});

export default UserNotification.discriminator('EntityAccessUserNotification', EntityAccessUserNotificationSchema);
