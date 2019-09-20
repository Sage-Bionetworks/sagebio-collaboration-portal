import mongoose from 'mongoose';
import InsightAttachmentSchema from './insight-attachment.schema';
import ResourceAttachmentSchema from './resource-attachment.schema';

var EntityAttachmentsSchema = new mongoose.Schema({
    insights: [InsightAttachmentSchema],
    resources: [ResourceAttachmentSchema],
});

export default EntityAttachmentsSchema;
