import { Router } from 'express';
import * as auth from '../../auth/auth.service';
// import * as threadAuth from './thread.auth';
import * as controller from './thread.controller';

var router = Router();

// Returns the thread specified
router.get('/:id', auth.isAuthenticated(), controller.show);

// Creates a new thread associated to the entity specified.
router.post('/', auth.isAuthenticated(), controller.create);

// Patches the thread specified.
router.patch('/:id', auth.isAuthenticated(), controller.patch);

// Returns the threads associated with the entity specified.
router.get('/entity/:entityId', auth.isAuthenticated(), controller.indexByEntity);

// Adds a message to the thread specified.
router.post('/:id/messages', auth.isAuthenticated(), controller.createMessage);

// Returns the number of messages for the thread specified.
router.get('/:id/messages/count', auth.isAuthenticated(), controller.messagesCount);





// import {
//     accessTypes,
// } from '../../config/environment';
// const ADMIN_ACCESS = accessTypes.ADMIN.value;
// const READ_ACCESS = accessTypes.READ.value;
// const WRITE_ACCESS = accessTypes.WRITE.value;

// // Returns the threads that the user has access to.
// router.get('/', auth.isAuthenticated(), controller.indexByUser);

// // Deletes the thread specified.
// router.delete('/entity/:entityId/:id',
// // auth.canAccessEntity(
// //     ADMIN_ACCESS
// // ),
// controller.destroy);

// // Returns the messages for the thread specified.
// router.get('/entity/:entityId/:id/messages',
// // auth.canAccessEntity(
// //     READ_ACCESS,
// //     WRITE_ACCESS,
// //     ADMIN_ACCESS
// // ),
// controller.indexMessages);

// // Patches the message specified.
// router.patch('/entity/:entityId/:id/messages/:messageId',
// // auth.hasPermissionForEntityRelatedObject(Thread),
// controller.patchMessage);

// // Deletes the message specified.
// router.delete('/entity/:entityId/:id/messages/:messageId',
// // auth.canAccessEntity(
// //     ADMIN_ACCESS
// // ),
// controller.destroyMessage);

module.exports = router;
