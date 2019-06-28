import mongoose from 'mongoose';
// import {
//     registerEvents
// } from './permission.events';

var UserPermissionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    permission: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission',
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

// registerEvents(UserPermissionSchema);
export default mongoose.model('UserPermission', UserPermissionSchema);
