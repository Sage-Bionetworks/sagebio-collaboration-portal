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
    domains: [{
        type: String,
        required: true
    }],
    picture: {
        type: String,
        default: 'https://via.placeholder.com/200x200'
    },
    active: {
        type: Boolean,
        required: true,
        default: false
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
