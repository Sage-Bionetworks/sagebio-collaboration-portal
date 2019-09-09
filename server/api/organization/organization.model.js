import mongoose from 'mongoose';
import { registerEvents } from './organization.events';
import { models as modelSpecs } from '../../config/environment';

var OrganizationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: modelSpecs.organization.title.minlength,
        maxlength: modelSpecs.organization.title.maxlength,
    },
    description: {
        type: String,
        required: true,
        minlength: modelSpecs.organization.description.minlength,
        maxlength: modelSpecs.organization.description.maxlength,
    },
    picture: {
        type: String,
        default: modelSpecs.organization.picture.default,
    },
    visibility: {
        type: String,
        required: true,
        enum: modelSpecs.organization.visibility.options.map(visibility => visibility.value),
        default: modelSpecs.organization.visibility.default.value,
    },
    website: {
        type: String,
        required: true,
    },
    domains: [
        {
            type: String,
            required: true,
        },
    ],
    active: {
        type: Boolean,
        required: true,
        default: false,
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

registerEvents(OrganizationSchema);
export default mongoose.model('Organization', OrganizationSchema);
