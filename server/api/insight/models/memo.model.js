import mongoose from 'mongoose';
import Insight from './insight.model';
import { insightTypes } from '../../../config/environment';

var MemoSchema = new mongoose.Schema({
    // attachments: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Insight'
    // }]
});

export default Insight.discriminator(insightTypes.MEMO.value, MemoSchema);
