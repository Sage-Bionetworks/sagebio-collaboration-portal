import mongoose from 'mongoose';
import User from '../user/user.model';
import { registerEvents } from './data-catalog.events';
import { models as modelSpecs } from '../../config/environment';

var DataCatalogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: modelSpecs.dataCatalog.title.minlength,
        maxlength: modelSpecs.dataCatalog.title.maxlength
    },
    description: {
        type: String,
        required: true,
        minlength: modelSpecs.dataCatalog.description.minlength,
        maxlength: modelSpecs.dataCatalog.description.maxlength
    },
    picture: {
        type: String,
        default: modelSpecs.dataCatalog.picture.default
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

/**
 * Middlewares
 */

const autoPopulatePre = function (next) {
    // eslint-disable-next-line no-invalid-this
    this
        .populate('createdBy', User.profileProperties);
    next();
};

const autoPopulatePost = function (doc) {
    return doc
        .populate('createdBy', User.profileProperties)
        .execPopulate();
};

DataCatalogSchema.pre('find', autoPopulatePre);
DataCatalogSchema.pre('findOne', autoPopulatePre);
DataCatalogSchema.post('save', autoPopulatePost);

DataCatalogSchema.index({ title: 'text' }, { weights: { title: 1 } });

registerEvents(DataCatalogSchema);
export default mongoose.model('DataCatalog', DataCatalogSchema);
