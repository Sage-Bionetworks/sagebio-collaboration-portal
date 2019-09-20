import { Router } from 'express';
import * as auth from '../../auth/auth.service';
import * as UserNotificationController from './user-notification.controller';

var router = Router();

router.get('/', auth.isAuthenticated(), UserNotificationController.index);
router.post('/', auth.isAuthenticated(), UserNotificationController.create);
router.patch('/:id/archive', auth.isAuthenticated(), UserNotificationController.archive);

module.exports = router;
