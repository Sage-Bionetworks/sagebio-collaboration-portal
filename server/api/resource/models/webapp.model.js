import mongoose from 'mongoose';
import Resource from './resource.model';
import { resourceTypes } from '../../../config/environment';

var WebAppSchema = new mongoose.Schema({

});

export default Resource.discriminator(resourceTypes.WEBAPP.value, WebAppSchema);
