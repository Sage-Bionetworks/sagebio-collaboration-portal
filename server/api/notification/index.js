import { Router } from 'express';
import * as entityNotificationController from './controllers/entity-notification.controller';
import * as entityAccessNotificationController from './controllers/entity-access-notification.controller';
import * as messageNotificationController from './controllers/message-notification.controller';

import * as auth from '../../auth/auth.service';

var router = Router();

router.get('/entity/', auth.isAuthenticated(), entityNotificationController.indexMine);
router.get('/entity/:id', entityNotificationController.show);
router.post('/entity/', entityNotificationController.create);
// router.patch('/entity/:id', entityNotificationController.patch);

router.get('/entity-access/', auth.isAuthenticated(), entityAccessNotificationController.indexMine);
router.get('/entity-access/:id', entityAccessNotificationController.show);
router.post('/entity-access/', entityAccessNotificationController.create);
// router.patch('/entity-access/:id', entityAccessNotificationController.patch);

router.get('/message/', auth.isAuthenticated(), messageNotificationController.indexMine);
router.get('/message/:id', messageNotificationController.show);
router.post('/message/', messageNotificationController.create);
// router.patch('/message/:id', messageNotificationController.patch);

module.exports = router;
