import mongoose from 'mongoose';
import {registerEvents} from './provenance.events';

var ProvenanceSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

registerEvents(ProvenanceSchema);
export default mongoose.model('Provenance', ProvenanceSchema);
