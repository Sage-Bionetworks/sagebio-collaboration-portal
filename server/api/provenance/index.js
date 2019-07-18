var express = require('express');
var controller = require('./provenance.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.getProvenanceGraph);  // auth.hasRole('admin'),
// router.get('/:id', controller.show);
// router.post('/', controller.create);
// router.put('/:id', controller.upsert);
// router.patch('/:id', controller.patch);
// router.delete('/:id', controller.destroy);

module.exports = router;
