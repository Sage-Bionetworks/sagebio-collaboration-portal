import { Router } from 'express';
import * as entityNotificationController from './controllers/entity-notification.controller';
import * as entityAccessNotificationController from './controllers/entity-access-notification.controller';
import * as messageNotificationController from './controllers/message-notification.controller';

import * as auth from '../../auth/auth.service';

var router = Router();


router.get('/message-notification/', auth.isAuthenticated(), messageNotificationController.indexMine);
router.get('/message-notification/:id', messageNotificationController.show);
router.post('/message-notification/', messageNotificationController.create);
// router.patch('/message-notification/:id', messageNotificationController.patch);

router.get('/entity-notification/', auth.isAuthenticated(), entityNotificationController.indexMine);
router.get('/entity-notification/:id', entityNotificationController.show);
router.post('/entity-notification/', entityNotificationController.create);
// router.patch('/entity-notification/:id', entityNotificationController.patch);

router.get('/entity-access-notification/', auth.isAuthenticated(), entityAccessNotificationController.indexMine);
router.get('/entity-access-notification/:id', entityAccessNotificationController.show);
router.post('/entity-access-notification/', entityAccessNotificationController.create);
// router.patch('/entity-access-notification/:id', entityAccessNotificationController.patch);

module.exports = router;
