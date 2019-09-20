import mongoose from 'mongoose';
import UserNotification from './user-notification.model';

var EntityAccessNotificationSchema = new mongoose.Schema({
    entityPermissionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EntityPermission',
        required: true,
    },
});

export default UserNotification.discriminator('EntityAccessNotification', EntityAccessNotificationSchema);
