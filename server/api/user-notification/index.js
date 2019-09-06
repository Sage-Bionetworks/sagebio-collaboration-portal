import { Router } from 'express';
import * as UserNotificationController from './user-notification.controller';

import * as auth from '../../auth/auth.service';

var router = Router();

router.get('/', auth.isAuthenticated(), UserNotificationController.indexMine);
router.patch('/:id/archive', auth.isAuthenticated(), UserNotificationController.archive);
router.post('/', auth.isAuthenticated(), UserNotificationController.create);

module.exports = router;
