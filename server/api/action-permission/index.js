import { Router } from 'express';
import * as controller from './action-permission.controller';
import * as auth from '../../auth/auth.service';

var router = Router();

router.get('/mine', auth.isAuthenticated(), controller.indexMine);

// router.get('/', controller.index);
// router.get('/:id', controller.show);
// router.post('/', controller.create);
// router.put('/:id', controller.upsert);
// router.patch('/:id', controller.patch);
// router.delete('/:id', controller.destroy);


module.exports = router;
