import mongoose from 'mongoose';
import Resource from './resource.model';

var DashboardSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    }
});

export default Resource.discriminator('Dashboard', DashboardSchema);
