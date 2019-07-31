var express = require('express');
var controller = require('./insight.controller');
import * as auth from '../../auth/auth.service';
import {
    accessTypes,
    userRoles
} from '../../config/environment';

const READ_ACCESS = accessTypes.ADMIN.value;
const WRITE_ACCESS = accessTypes.ADMIN.value;
const ADMIN_ACCESS = accessTypes.ADMIN.value;

var router = express.Router();

// router.get('/', controller.index);
// router.get('/:id', controller.show);
// router.post('/', controller.create);
// router.put('/:id', controller.upsert);
// router.patch('/:id', controller.patch);
// router.delete('/:id', controller.destroy);

router.get('/entity/:entityId', auth.hasPermissionForEntity([
  READ_ACCESS,
  WRITE_ACCESS,
  ADMIN_ACCESS
]), controller.indexByEntity);

module.exports = router;
