import mongoose from 'mongoose';
import {
    registerEvents
} from './data-catalog.events';
// import { DataCatalog } from "../../../shared/interfaces/data-catalogs.model";

var DataCatalogSchema = new mongoose.Schema({
    slug: {
        type: String,
        required: true,
        unique: true
    },
    name: {
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

registerEvents(DataCatalogSchema);
export default mongoose.model('DataCatalog', DataCatalogSchema);
