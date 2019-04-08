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
    image: String,
    apiBaseUri: String,
    website: String,
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
