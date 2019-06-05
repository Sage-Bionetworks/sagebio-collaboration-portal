import mongoose from 'mongoose';
import BaseMessage from './base-message.model';

var ReplySchema = new mongoose.Schema({
    thread: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }
});

export default BaseMessage.discriminator('Reply', ReplySchema);
