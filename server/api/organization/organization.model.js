import mongoose from 'mongoose';
import {
    registerEvents
} from './organization.events';

var OrganizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    website: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        default: 'https://via.placeholder.com/200x150'
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

registerEvents(OrganizationSchema);
export default mongoose.model('Organization', OrganizationSchema);
