import mongoose from 'mongoose';
import Resource from './resource.model';

var StateSchema = new mongoose.Schema({
    data: {
        type: String,
        required: true
    }
});

export default Resource.discriminator('State', StateSchema);
