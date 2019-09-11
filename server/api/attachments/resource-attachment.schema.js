import mongoose from 'mongoose';

var ResourceAttachmentSchema = new mongoose.Schema({
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

export default ResourceAttachmentSchema;
