import mongoose from 'mongoose';
import Resource from './resource.model';

var StateSchema = new mongoose.Schema({
    data: {
        type: String,
    },
    tool: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tool'
    }
});

export default Resource.discriminator('State', StateSchema);
