import mongoose from 'mongoose';
import { registerEvents } from './data-catalog.events';
import { models as modelSpecs } from '../../config/environment';

var DataCatalogSchema = new mongoose.Schema({
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
        default: 'https://via.placeholder.com/200/8a2be2/8a2be2'
    },
    visibility: {
        type: String,
        required: true,
        enum: modelSpecs.dataCatalog.visibility.options.map(visibility => visibility.value),
        default: modelSpecs.dataCatalog.visibility.default.value,
    },
    website: {
        type: String,
        required: true,
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true,
    },
    apiType: {
        type: String,
        enum: modelSpecs.dataCatalog.apiType.options.map(apiType => apiType.value),
        required: true,
    },
    apiServerUrl: {
        type: String,
        required: true,
    },
    apiHealthCheckUrl: {
        type: String,
        required: true
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

DataCatalogSchema.index({ title: 'text' }, { weights: { title: 1 } });

registerEvents(DataCatalogSchema);
export default mongoose.model('DataCatalog', DataCatalogSchema);
