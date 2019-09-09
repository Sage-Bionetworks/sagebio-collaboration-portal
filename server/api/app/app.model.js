import mongoose from 'mongoose';
import { models as modelSpecs } from '../../config/environment';

var AppSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    picture: {
        type: String,
        default: modelSpecs.app.picture.default,
    },
    visibility: {
        type: String,
        required: true,
        enum: modelSpecs.app.visibility.options.map(visibility => visibility.value),
        default: modelSpecs.app.visibility.default.value,
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
});

export default mongoose.model('App', AppSchema);
