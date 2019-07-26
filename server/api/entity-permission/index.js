var express = require('express');
var controller = require('./entity-permission.controller');
import * as auth from '../../auth/auth.service';
import {
    accessTypes,
    userRolesNew
} from '../../config/environment';

const ADMIN_ROLE = userRolesNew.ADMIN.value;
const ADMIN_ACCESS = accessTypes.ADMIN.value;

var router = express.Router();

router.get('/', auth.hasRole(ADMIN_ROLE), controller.index);
router.get('/mine', auth.isAuthenticated(), controller.indexMine);

router.get('/entity/:entityId', auth.hasPermissionForEntity([ADMIN_ACCESS]),
    controller.indexByEntity);
router.post('/entity/:entityId', auth.hasPermissionForEntity([ADMIN_ACCESS]),
    controller.create);
router.patch('/entity/:entityId/:id', auth.hasPermissionForEntity([ADMIN_ACCESS]),
    controller.patch);
router.delete('/entity/:entityId/:id', auth.hasPermissionForEntity([ADMIN_ACCESS]),
    controller.destroy);

module.exports = router;
