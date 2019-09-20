import mongoose from 'mongoose';
import UserNotification from './user-notification.model';

var MessageUserNotificationSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
    },
});

export default UserNotification.discriminator('MessageUserNotification', MessageUserNotificationSchema);
