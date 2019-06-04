import mongoose from 'mongoose';
import {
    registerEvents
} from './starred-message.events';

var StarredMessageSchema = new mongoose.Schema({
    message: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    starredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    archived: {
        type: Boolean,
        default: false
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
});

StarredMessageSchema
    .pre('deleteMany', function (next) {
        console.log('StarredMessageSchema deleteMany pre save hook', this);
        return next();
    });

  StarredMessageSchema
      .post('deleteMany', function (doc) {
          console.log('StarredMessageSchema deleteMany post save hook', doc);
          return doc;
      });

StarredMessageSchema.pre('remove', { query: true }, function() {
  console.log('StarredMessageSchema remove');
});

StarredMessageSchema.index({ message: 1, starredBy: 1}, { unique: true });
registerEvents(StarredMessageSchema);
export default mongoose.model('StarredMessage', StarredMessageSchema);
