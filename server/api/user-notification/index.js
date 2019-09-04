import { Router } from 'express';
import * as NotificationController from './controllers/notification.controller';

import * as auth from '../../auth/auth.service';

var router = Router();

router.get('/', auth.isAuthenticated(), NotificationController.indexMine);
// router.get('/message-notification/:id', messageNotificationController.show);
// router.post('/message-notification/', messageNotificationController.create);
router.patch('/:id', NotificationController.patch);

// router.get('/entity-notification/:id', entityNotificationController.show);
// router.post('/entity-notification/', entityNotificationController.create);
// router.patch('/entity-notification/:id', entityNotificationController.patch);

// router.get('/entity-access-notification/:id', entityAccessNotificationController.show);
// router.post('/entity-access-notification/', entityAccessNotificationController.create);
// router.patch('/entity-access-notification/:id', entityAccessNotificationController.patch);

module.exports = router;
