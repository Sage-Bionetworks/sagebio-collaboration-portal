import { Router } from 'express';
import * as entityNotificationController from './controllers/entity-notification.controller';
import * as entityAccessNotificationController from './controllers/entity-access-notification.controller';
import * as messageNotificationController from './controllers/message-notification.controller';

import * as auth from '../../auth/auth.service';

var router = Router();

router.get('/entity/', entityNotificationController.index);
router.get('/entity/:id', entityNotificationController.show);
router.get('/entity/mine', auth.isAuthenticated(), entityNotificationController.indexMine);
router.post('/entity/', entityNotificationController.create);
// router.put('/entity/:id', entityNotificationController.upsert);
// router.patch('/entity/:id', entityNotificationController.patch);
router.delete('/entity/:id', entityNotificationController.destroy);

router.get('/entity-access/', entityAccessNotificationController.index);
router.get('/entity-access/:id', entityAccessNotificationController.show);
router.get('/entity-access/mine', auth.isAuthenticated(), entityAccessNotificationController.indexMine);
router.post('/entity-access/', entityAccessNotificationController.create);
// router.put('/entity-access/:id', entityAccessNotificationController.upsert);
// router.patch('/entity-access/:id', entityAccessNotificationController.patch);
router.delete('/entity-access/:id', entityAccessNotificationController.destroy);

router.get('/message/', messageNotificationController.index);
router.get('/messagen/:id', messageNotificationController.show);
router.get('/message/mine', auth.isAuthenticated(), messageNotificationController.indexMine);
router.post('/message/', messageNotificationController.create);
// router.put('/message/:id', messageNotificationController.upsert);
// router.patch('/message/:id', messageNotificationController.patch);
router.delete('/message/:id', messageNotificationController.destroy);

module.exports = router;
