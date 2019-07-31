import mongoose from 'mongoose';
import Resource from './resource.model';

var WebAppSchema = new mongoose.Schema({

});

export default Resource.discriminator('WebApp', WebAppSchema);
