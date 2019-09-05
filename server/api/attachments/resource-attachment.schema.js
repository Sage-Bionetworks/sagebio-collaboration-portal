import mongoose from 'mongoose';

var ResourceAttachmentSchema = new mongoose.Schema({
    entityId: {
        type: String,
    },
    // WIP Remove name and use the entityId when lookup is implemented
    name: {
        type: String,
    },
});

export default ResourceAttachmentSchema;
