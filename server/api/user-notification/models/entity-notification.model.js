import mongoose from 'mongoose';
import Notification from './notification.model';
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

export default Notification.discriminator('EntityNotification', EntityNotificationSchema);
