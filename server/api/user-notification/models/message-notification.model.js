import mongoose from 'mongoose';
import Notification from './notification.model';

var MessageNotificationSchema = new mongoose.Schema({
    messageBody: {
        type: String,
        required: true,
    },
});

export default Notification.discriminator('MessageNotification', MessageNotificationSchema);
