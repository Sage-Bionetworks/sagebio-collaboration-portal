import mongoose from 'mongoose';
import { registerEvents } from './entity-permission.events';
import User from '../user/user.model';
import config from '../../config/environment';

var EntityPermissionSchema = new mongoose.Schema({
    entityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    entityType: {
        type: String,
        enum: Object.values(config.entityTypes).map(entity => entity.value),
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    access: {
        type: String,
        enum: Object.values(config.accessTypes).map(access => access.value),
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(config.inviteStatusTypes).map(status => status.value),
        default: config.inviteStatusTypes.PENDING.value,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true,
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

/**
 * Middlewares
 */

const autoPopulatePre = function (next) {
    this.populate('user', User.profileProperties).populate('createdBy', User.profileProperties);
    next();
};

const autoPopulatePost = function (doc) {
    return doc
        .populate('user', User.profileProperties)
        .populate('createdBy', User.profileProperties)
        .execPopulate();
};

EntityPermissionSchema.pre('find', autoPopulatePre);
EntityPermissionSchema.post('save', autoPopulatePost);

EntityPermissionSchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        next(new Error('User is already a collaborator'));
    } else {
        next(error);
    }
});

registerEvents(EntityPermissionSchema);
EntityPermissionSchema.index(
    {
        entityId: 1,
        entityType: 1,
        user: 1,
    },
    {
        unique: true,
    }
);
export default mongoose.model('EntityPermission', EntityPermissionSchema);
