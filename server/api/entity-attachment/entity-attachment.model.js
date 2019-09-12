import mongoose from 'mongoose';
import config from '../../config/environment';

var EntityAttachmentSchema = new mongoose.Schema({
    entityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    entityType: {
        type: String,
        enum: Object.values(config.entityTypes).map(entity => entity.value),
        required: true,
    },
    parentEntityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
});

export default mongoose.model('EntityAttachment', EntityAttachmentSchema);
