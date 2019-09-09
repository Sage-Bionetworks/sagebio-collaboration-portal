import mongoose from 'mongoose';
import Resource from './resource.model';
import { resourceTypes } from '../../../config/environment';

var ArticleSchema = new mongoose.Schema({});

export default Resource.discriminator(resourceTypes.ARTICLE.value, ArticleSchema);
