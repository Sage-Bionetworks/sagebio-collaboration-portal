import mongoose from 'mongoose';
import Insight from './insight.model';

var DashboardSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    }
});

export default Insight.discriminator('Dashboard', DashboardSchema);
