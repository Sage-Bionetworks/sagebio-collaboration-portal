import mongoose from 'mongoose';
import {
    registerEvents
} from './dataset.events';

var DatasetSchema = new mongoose.Schema({
    _id: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// DatasetSchema.index({
//   name: 'text',
// }, {
//   weights: { name: 2}
// });

registerEvents(DatasetSchema);
export default mongoose.model('Dataset', DatasetSchema);
