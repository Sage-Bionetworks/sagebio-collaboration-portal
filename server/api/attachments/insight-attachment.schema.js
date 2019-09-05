import mongoose from 'mongoose';

var InsightAttachmentSchema = new mongoose.Schema({
    entityId: {
        type: String,
    },
    // WIP Remove name and use the entityId when lookup is implemented
    name: {
        type: String,
    },
});

export default InsightAttachmentSchema;
