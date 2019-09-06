import mongoose from 'mongoose';

var InsightAttachmentSchema = new mongoose.Schema({
    entityId: {
        type: String,
    },
    entityType: {
        type: String,
    },
    name: {
        type: String,
    },
});

export default InsightAttachmentSchema;
