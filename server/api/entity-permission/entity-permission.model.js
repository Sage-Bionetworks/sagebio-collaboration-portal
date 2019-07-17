import mongoose from 'mongoose';
import {
    registerEvents
} from './entity-permission.events';
import config from '../../config/environment';

var EntityPermissionSchema = new mongoose.Schema({
    entityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    entityType: {
        type: String,
        enum: Object.values(config.entityTypes).map(entity => entity.value),
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    access: {
        type: String,
        enum: Object.values(config.accessTypes).map(access => access.value),
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    __v: {
        type: Number,
        select: false
    }
});

registerEvents(EntityPermissionSchema);
EntityPermissionSchema.index({
    entityId: 1,
    entityType: 1,
    userId: 1,
    access: 1
}, {
    unique: true
});
export default mongoose.model('EntityPermission', EntityPermissionSchema);
