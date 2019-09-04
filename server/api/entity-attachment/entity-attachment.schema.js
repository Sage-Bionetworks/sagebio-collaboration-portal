import mongoose from 'mongoose';


// TODO Create ResourceAttachmentSchema and InsightAttachmentSchema
var EntityAttachmentSchema = new mongoose.Schema({
    // TODO Change to subEntityType (join both Insights and Resources types e.g. Report, State, Dashboard)
    model: {
        type: String,
        required: true
    },
    // TODO Change source to entityType
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
