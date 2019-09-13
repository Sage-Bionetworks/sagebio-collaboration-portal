import mongoose from 'mongoose';
import Resource from './resource.model';
import { resourceTypes } from '../../../config/environment';

var StateSchema = new mongoose.Schema({
    data: {
        type: String,
    },
    tool: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tool',
        required: true
    },
});

/**
 * Middlewares
 */

const autoPopulatePre = function (next) {
    // eslint-disable-next-line no-invalid-this
    this
        .populate('tool');
    next();
};

const autoPopulatePost = function (doc) {
    return doc
        .populate('tool')
        .execPopulate();
};

StateSchema.pre('find', autoPopulatePre);
StateSchema.pre('findOne', autoPopulatePre);
StateSchema.post('save', autoPopulatePost);

export default Resource.discriminator(resourceTypes.STATE.value, StateSchema);
