import mongoose from 'mongoose';
import {registerEvents} from './reply.events';

var ReplySchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

registerEvents(ReplySchema);
export default mongoose.model('Reply', ReplySchema);
