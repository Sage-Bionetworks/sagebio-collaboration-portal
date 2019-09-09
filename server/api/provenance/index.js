import { Router } from 'express';
import * as auth from '../../auth/auth.service';
import * as controller from './provenance.controller';

var router = Router();

router.post('/', controller.createProvenanceActivity);  // auth.hasRole('admin')
router.post('/batch', controller.createActivitiesBatch);  // auth.hasRole('admin')
router.get('/', controller.getProvenanceGraph);  // auth.hasRole('admin')
router.get('/byAgent/:agentId', controller.getProvenanceGraphByAgent);
router.get('/byReference/:referenceId', controller.getProvenanceGraphByReference);

module.exports = router;
