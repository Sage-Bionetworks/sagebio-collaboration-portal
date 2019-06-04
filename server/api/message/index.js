var express = require('express');
var controller = require('./message.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
// router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);

router.post('/:id/star', auth.isAuthenticated(), controller.star);
router.delete('/:id/unstar', auth.isAuthenticated(), controller.unstar);
router.get('/:id/star/count', controller.starCount);

module.exports = router;
