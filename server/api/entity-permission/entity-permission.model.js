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
        enum: config.entityTypes,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    access: {
        type: String,
        enum: config.accessTypes,
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
    entity: 1,
    entityType: 1,
    user: 1,
    access: 1
}, {
    unique: true
});
export default mongoose.model('EntityPermission', EntityPermissionSchema);
