import mongoose from 'mongoose';
// import {
//     registerEvents
// } from './permission.events';
import {
  actionPermissionTypes
} from '../../config/environment';

var UserPermissionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    permission: {
        type: String,
        enum: Object.values(actionPermissionTypes).map(action => action.value),
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
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

// registerEvents(UserPermissionSchema);
UserPermissionSchema.index({ user: 1, permission: 1}, { unique: true });
export default mongoose.model('UserPermission', UserPermissionSchema);
