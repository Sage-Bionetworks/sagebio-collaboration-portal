import mongoose from 'mongoose';
import UserNotification from './user-notification.model';
import { entityTypes } from '../../../config/environment';

var EntityNotificationSchema = new mongoose.Schema({
    entityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    entityType: {
        type: String,
        enum: Object.values(entityTypes).map(type => type.value),
        required: true,
    },
    message: {
        type: String,
        required: false,
    },
});

export default UserNotification.discriminator('EntityNotification', EntityNotificationSchema);
