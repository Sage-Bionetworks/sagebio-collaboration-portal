import mongoose from 'mongoose';
import Resource from './resource.model';

var DashboardSchema = new mongoose.Schema({

});

export default Resource.discriminator('Dashboard', DashboardSchema);
