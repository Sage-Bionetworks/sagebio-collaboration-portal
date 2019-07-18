var express = require('express');
var controller = require('./entity-permission.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
// router.get('/:id', controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
// router.put('/:id', controller.upsert);
router.patch('/:id', auth.isAuthenticated(), controller.patch);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

router.get('/mine', auth.isAuthenticated(), controller.indexMine);
router.get('/entity/:id', auth.isAuthenticated(), controller.indexEntityPermissions);  // TODO: Must be admin of entity
// router.put('/:id/access', auth.isAuthenticated(), controller.changeAccess);
// router.post('/entity/:id', auth.isAuthenticated(), controller.createEntityPermission);   // TODO: Must be admin of entity
// router.delete('/entity/:id', auth.isAuthenticated(), controller.destroyEntityPermission);  // TODO: Must be admin of entity

// auth.hasEntityPermission('EDIT', projectId)

module.exports = router;
