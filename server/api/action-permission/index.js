import { Router } from 'express';
import * as auth from '../../auth/auth.service';
import * as actionPermissionAuth from './action-permission.auth';
import * as controller from './action-permission.controller';

var router = Router();

router.get('/', auth.isAuthenticated(), controller.index);

router.get('/users/:userId', actionPermissionAuth.canReadActionPermission(), controller.indexByUser);

router.post('/', actionPermissionAuth.canCreateActionPermission(), controller.create);

router.delete('/:id', actionPermissionAuth.canDeleteActionPermission(), controller.destroy);

module.exports = router;
