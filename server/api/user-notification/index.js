import { Router } from 'express';
import * as NotificationController from './controllers/notification.controller';

import * as auth from '../../auth/auth.service';

var router = Router();

router.get('/', auth.isAuthenticated(), NotificationController.indexMine);
router.patch('/:id/archive', NotificationController.archive);
// router.get('/message-notification/:id', messageNotificationController.show);
// router.post('/message-notification/', messageNotificationController.create);

module.exports = router;
