import { Router } from 'express';
import * as controller from './action-permission.controller';
import * as auth from '../../auth/auth.service';
import * as actionPermissionAuth from './action-permission.auth';

var router = Router();

router.get('/', auth.isAuthenticated(), controller.index);

router.get('/users/:userId', actionPermissionAuth.canReadActionPermissionsByUser(), controller.indexByUser);

// router.get('/', controller.index);
// router.get('/:id', controller.show);
// router.post('/', controller.create);
// router.put('/:id', controller.upsert);
// router.patch('/:id', controller.patch);
// router.delete('/:id', controller.destroy);

module.exports = router;
