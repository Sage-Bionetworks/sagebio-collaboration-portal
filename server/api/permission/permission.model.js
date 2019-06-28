import mongoose from 'mongoose';
import {
    registerEvents
} from './permission.events';

var PermissionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    __v: {
        type: Number,
        select: false
    }
});

registerEvents(PermissionSchema);
export default mongoose.model('Permission', PermissionSchema);
