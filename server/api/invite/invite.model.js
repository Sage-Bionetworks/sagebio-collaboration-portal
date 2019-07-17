import mongoose from 'mongoose';
import {registerEvents} from './invite.events';

var InviteSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

registerEvents(InviteSchema);
export default mongoose.model('Invite', InviteSchema);
