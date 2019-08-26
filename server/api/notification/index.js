import { Router } from 'express';
import * as entityNotificationController from './controllers/entity-notification.controller';
import * as entityAccessNotificationController from './controllers/entity-access-notification.controller';
import * as messageNotificationController from './controllers/message-notification.controller';

import * as auth from '../../auth/auth.service';

var router = Router();

router.get('/entity-notification/', entityNotificationController.index);
router.get('/entity-notification/:id', entityNotificationController.show);
router.get('/entity-notification/mine', auth.isAuthenticated(), entityNotificationController.indexMine);
router.post('/entity-notification/', entityNotificationController.create);
// router.put('/entity-notification/:id', entityNotificationController.upsert);
// router.patch('/entity-notificatio/:id', entityNotificationController.patch);
router.delete('/entity-notification/:id', entityNotificationController.destroy);

router.get('/entity-access-notificatio/', entityAccessNotificationController.index);
router.get('/entity-access-notification/:id', entityAccessNotificationController.show);
router.get('/entity-access-notificatio/mine', auth.isAuthenticated(), entityAccessNotificationController.indexMine);
router.post('/entity-access-notificatio/', entityAccessNotificationController.create);
// router.put('/entity-access-notificatio/:id', entityAccessNotificationController.upsert);
// router.patch('/entity-access-notificatio/:id', entityAccessNotificationController.patch);
router.delete('/entity-access-notificatio/:id', entityAccessNotificationController.destroy);

router.get('/message-notification/', messageNotificationController.index);
router.get('/message-notificationn/:id', messageNotificationController.show);
router.get('/message-notification/mine', auth.isAuthenticated(), messageNotificationController.indexMine);
router.post('/message-notification/', messageNotificationController.create);
// router.put('/message-notification/:id', messageNotificationController.upsert);
// router.patch('/message-notification/:id', messageNotificationController.patch);
router.delete('/message-notification/:id', messageNotificationController.destroy);

module.exports = router;
