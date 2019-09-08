import mongoose from 'mongoose';
import { actionPermissionTypes } from '../../config/environment';

var ActionPermissionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    action: {
        type: String,
        enum: Object.values(actionPermissionTypes).map(action => action.value),
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    __v: {
        type: Number,
        select: false,
    },
});

// registerEvents(ActionPermissionSchema);
ActionPermissionSchema.index({ user: 1, action: 1 }, { unique: true });
export default mongoose.model('ActionPermission', ActionPermissionSchema);
