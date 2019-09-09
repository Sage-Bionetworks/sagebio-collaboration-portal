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
    },
});

export default Resource.discriminator(resourceTypes.STATE.value, StateSchema);
