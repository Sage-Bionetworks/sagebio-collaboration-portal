import mongoose from 'mongoose';
import {
    registerEvents
} from './project.events';
import { models as modelSpecs } from '../../config/environment';

var ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        minlength: modelSpecs.project.title.minlength,
        maxlength: modelSpecs.project.title.maxlength
    },
    description: {
        type: String,
        required: true,
        minlength: modelSpecs.project.description.minlength,
        maxlength: modelSpecs.project.description.maxlength
    },
    picture: {
        type: String,
        default: modelSpecs.project.picture.default
    },
    visibility: {
        type: String,
        required: true,
        enum: modelSpecs.project.visibility.options.map(visibility => visibility.value),
        default: modelSpecs.project.visibility.default.value,
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

ProjectSchema.index({ title: 'text' }, { weights: { title: 1 }});

registerEvents(ProjectSchema);
export default mongoose.model('Project', ProjectSchema);
