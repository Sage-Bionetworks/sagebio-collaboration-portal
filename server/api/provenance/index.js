var express = require('express');
var controller = require('./provenance.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.post('/', controller.createProvenanceActivity);  // auth.hasRole('admin')
router.get('/', controller.getProvenanceGraph);  // auth.hasRole('admin')
router.get('/byAgent/:agentId', controller.getProvenanceGraphByAgent);
router.get('/byReference/:referenceId', controller.getProvenanceGraphByReference);

module.exports = router;
