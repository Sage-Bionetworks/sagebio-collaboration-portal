import mongoose from 'mongoose';
import Insight from './insight.model';

var StateSchema = new mongoose.Schema({
    data: {
        type: String,
        required: true
    }
});

export default Insight.discriminator('State', StateSchema);
