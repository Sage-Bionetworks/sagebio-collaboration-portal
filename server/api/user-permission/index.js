import { Router } from 'express';
import * as controller from './user-permission.controller';
import * as auth from '../../auth/auth.service';

var router = Router();

router.get('/', controller.index);
// router.get('/:id', controller.show);
// router.post('/', controller.create);
// router.put('/:id', controller.upsert);
// router.patch('/:id', controller.patch);
// router.delete('/:id', controller.destroy);
//
router.get('/mine', auth.isAuthenticated(), controller.indexMine);

module.exports = router;
