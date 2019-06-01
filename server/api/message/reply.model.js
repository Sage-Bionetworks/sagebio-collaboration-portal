import mongoose from 'mongoose';
import Message from './message.model';

var ReplySchema = new mongoose.Schema({
    replyTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
});

export default Message.discriminator('Reply', ReplySchema);
