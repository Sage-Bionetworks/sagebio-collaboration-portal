import { Router } from 'express';
import * as auth from '../../auth/auth.service';
import * as entityPermissionAuth from './entity-permission.auth';
import * as controller from './entity-permission.controller';

var router = Router();

router.get('/', auth.isAuthenticated(), controller.index);

router.get('/entity/:entityId', entityPermissionAuth.canReadEntityPermission(), controller.indexByEntity);

router.post('/', entityPermissionAuth.canCreateEntityPermission(), controller.create);

router.patch('/:id', entityPermissionAuth.canEditEntityPermission(), controller.patch);

router.delete('/:id', entityPermissionAuth.canDeleteEntityPermission(), controller.destroy);

module.exports = router;
