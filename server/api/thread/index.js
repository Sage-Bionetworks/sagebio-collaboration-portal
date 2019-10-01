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

// Deletes the thread specified along its messages.
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

// Returns the threads associated with the entity specified.
router.get('/entity/:entityId', auth.isAuthenticated(), controller.indexByEntity);

// Returns the messages for the thread specified.
router.get('/:id/messages', auth.isAuthenticated(), controller.indexMessages);

// Adds a message to the thread specified.
router.post('/:id/messages', auth.isAuthenticated(), controller.createMessage);

// Patches the message specified.
router.patch('/:id/messages/:messageId', auth.isAuthenticated(), controller.patchMessage);

// Returns the number of messages for the thread specified.
router.get('/:id/messages/count', auth.isAuthenticated(), controller.messagesCount);

// Deletes the message specified.
router.delete('/:id/messages/:messageId', auth.isAuthenticated(), controller.destroyMessage);








// import {
//     accessTypes,
// } from '../../config/environment';
// const ADMIN_ACCESS = accessTypes.ADMIN.value;
// const READ_ACCESS = accessTypes.READ.value;
// const WRITE_ACCESS = accessTypes.WRITE.value;

// // Returns the threads that the user has access to.
// router.get('/', auth.isAuthenticated(), controller.indexByUser);

module.exports = router;
