import mongoose from 'mongoose';
import UserNotification from './user-notification.model';

var MessageNotificationSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
    },
});

export default UserNotification.discriminator('MessageNotification', MessageNotificationSchema);
