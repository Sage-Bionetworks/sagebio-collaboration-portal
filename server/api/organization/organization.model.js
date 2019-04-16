import mongoose from 'mongoose';
import {
    registerEvents
} from './organization.events';

var OrganizationSchema = new mongoose.Schema({
    _id: {
        type: String
    },
    name: String,
    website: String,
    picture: String
});

registerEvents(OrganizationSchema);
export default mongoose.model('Organization', OrganizationSchema);
