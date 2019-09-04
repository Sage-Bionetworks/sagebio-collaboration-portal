import mongoose from 'mongoose';

var EntityAttachmentSchema = new mongoose.Schema({
    model: {
        type: String,
        required: true
    },
    source: {
        type: String,
        required: true,
    },
    // WIP Remove name and use the entityId when lookup is implemented
    name: {
        type: String,
    },
});

export default EntityAttachmentSchema;
