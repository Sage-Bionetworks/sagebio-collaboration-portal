import mongoose from 'mongoose';

var EntityAttachmentSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    name: {
        type: String,
    },
});

export default EntityAttachmentSchema;
