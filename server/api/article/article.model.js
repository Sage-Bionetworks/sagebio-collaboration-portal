import mongoose from 'mongoose';
import {
    registerEvents
} from './article.events';

var ArticleSchema = new mongoose.Schema({
    slug: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    body: {
        type: String,
        required: false
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
    }],
    favorited: {
        type: Boolean,
        default: false
    },
    favoritesCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    __v: {
        type: Number,
        select: false
    }
});

registerEvents(ArticleSchema);
export default mongoose.model('Article', ArticleSchema);
