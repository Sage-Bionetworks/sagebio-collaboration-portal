var express = require('express');
var controller = require('./entity-permission.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
// router.get('/:id', controller.show);
// router.post('/', controller.create);
// router.put('/:id', controller.upsert);
// router.patch('/:id', controller.patch);
// router.delete('/:id', controller.destroy);
router.get('/mine', auth.isAuthenticated(), controller.indexMine);

module.exports = router;
