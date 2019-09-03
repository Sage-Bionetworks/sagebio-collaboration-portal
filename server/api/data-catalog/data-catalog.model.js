import mongoose from 'mongoose';
import {
    registerEvents
} from './data-catalog.events';
import config from '../../config/environment';

var DataCatalogSchema = new mongoose.Schema({
    slug: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        default: 'https://via.placeholder.com/200x150'
    },
    visibility: {
        type: String,
        required: true,
        enum: Object.values(config.entityVisibility).map(visibility => visibility.value),
        default: config.models.dataCatalog.visibility.default
    },
    website: {
        type: String,
        required: true
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    apiType: {
        type: String,
        enum: ['CKAN'],
        required: true
    },
    apiServerUrl: {
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
        required: true
    },
    __v: {
        type: Number,
        select: false
    }
});

DataCatalogSchema.index({ title: 'text' }, { weights: { title: 1 }});

registerEvents(DataCatalogSchema);
export default mongoose.model('DataCatalog', DataCatalogSchema);
