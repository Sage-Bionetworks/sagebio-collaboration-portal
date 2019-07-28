import mongoose from 'mongoose';
import Resource from './resource.model';

var ReportSchema = new mongoose.Schema({
    attachments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resource'
    }]
});

export default Resource.discriminator('Report', ReportSchema);
