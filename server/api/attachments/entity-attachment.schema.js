import mongoose from 'mongoose';
import InsightAttachmentSchema from './insight-attachment.schema';
import ResourceAttachmentSchema from './resource-attachment.schema';

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
    insights: [InsightAttachmentSchema],
    resources: [ResourceAttachmentSchema],
});

export default EntityAttachmentSchema;
