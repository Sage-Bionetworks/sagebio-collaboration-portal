import mongoose from 'mongoose';
import {
    registerEvents
} from './data-catalog.events';

var DataCatalogSchema = new mongoose.Schema({
    _id: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    apiType: {
        type: String,
        enum: ['CKAN'],
        required: true
    },
    image: String,
    apiServerUrl: String,
    website: String,
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        // required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }
});

registerEvents(DataCatalogSchema);
export default mongoose.model('DataCatalog', DataCatalogSchema);
