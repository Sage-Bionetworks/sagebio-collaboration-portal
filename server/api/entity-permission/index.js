var express = require('express');
var controller = require('./entity-permission.controller');
import * as auth from '../../auth/auth.service';
import { accessTypes } from '../../config/environment/shared';

var router = express.Router();
const ADMIN_ROLE_FOR_ENTITY = accessTypes.ADMIN.value;

// Entity permissions
router.get('/', auth.hasPermissionForEntity(ADMIN_ROLE_FOR_ENTITY), controller.index);
router.post('/', auth.hasPermissionForEntity(ADMIN_ROLE_FOR_ENTITY), controller.create);
router.get('/mine', auth.isAuthenticated(), controller.indexMine);

// Specific entity permission object - defining access for a specific user on a known entity
router.patch('/:id', auth.hasPermissionForEntity(ADMIN_ROLE_FOR_ENTITY), controller.patch);
router.delete('/:id', auth.hasPermissionForEntity(ADMIN_ROLE_FOR_ENTITY), controller.destroy);
// router.get('/:id', controller.show);
// router.put('/:id', controller.upsert);
// router.put('/:id/access', auth.isAuthenticated(), controller.changeAccess);

// A specific entity (project, etc)
router.get('/entity/:id', auth.hasPermissionForEntity(ADMIN_ROLE_FOR_ENTITY), controller.indexEntityPermissions);
// router.post('/entity/:id', auth.hasPermissionForEntity(ADMIN_ROLE_FOR_ENTITY), controller.createEntityPermission); // WIP #231 - Use auth.hasPermissionForEntity(ADMIN_ROLE_FOR_ENTITY)
// router.delete('/entity/:id', auth.hasPermissionForEntity(ADMIN_ROLE_FOR_ENTITY), controller.destroyEntityPermission); // WIP #231 - Use auth.hasPermissionForEntity(ADMIN_ROLE_FOR_ENTITY)

module.exports = router;
