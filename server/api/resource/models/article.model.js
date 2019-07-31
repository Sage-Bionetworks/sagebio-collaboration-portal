import mongoose from 'mongoose';
import Resource from './resource.model';

var ArticleSchema = new mongoose.Schema({

});

export default Resource.discriminator('Article', ArticleSchema);
