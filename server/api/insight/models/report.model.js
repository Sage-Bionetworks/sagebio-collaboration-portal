import mongoose from 'mongoose';
import Insight from './insight.model';

var ReportSchema = new mongoose.Schema({
    // attachments: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Insight'
    // }]
});

export default Insight.discriminator('report', ReportSchema);
