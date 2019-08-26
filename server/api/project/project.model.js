import mongoose from 'mongoose';
import {
    registerEvents
} from './project.events';
import config from '../../config/environment';

var ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        minlength: config.models.project.title.minlength,
        maxlength: config.models.project.title.maxlength
    },
    description: {
        type: String,
        required: true,
        minlength: config.models.project.description.minlength,
        maxlength: config.models.project.description.maxlength
    },
    picture: {
        type: String,
        default: 'https://via.placeholder.com/200x200'
    },
    visibility: {
        type: String,
        required: false,
        enum: Object.values(config.entityVisibility).map(visibility => visibility.value),
        default: config.models.project.visibility.default
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

registerEvents(ProjectSchema);
export default mongoose.model('Project', ProjectSchema);
