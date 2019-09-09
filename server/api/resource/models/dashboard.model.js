import mongoose from 'mongoose';
import Resource from './resource.model';
import { resourceTypes } from '../../../config/environment';

var DashboardSchema = new mongoose.Schema({});

export default Resource.discriminator(resourceTypes.DASHBOARD.value, DashboardSchema);
