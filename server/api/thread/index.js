var express = require('express');
var controller = require('./thread.controller');
var auth = require('../../auth/auth.service');
import Thread from './thread.model';

var router = express.Router();

import {
    accessTypes,
} from '../../config/environment';
const ADMIN_ACCESS = accessTypes.ADMIN.value;
const READ_ACCESS = accessTypes.READ.value;
const WRITE_ACCESS = accessTypes.WRITE.value;

// Returns the threads that the user has access to.
router.get('/', auth.isAuthenticated(), controller.indexByUser);

// Creates a new thread associated to the entity specified.
router.post('/entity/:entityId',
// auth.canAccessEntity(
//     READ_ACCESS,
//     WRITE_ACCESS,
//     ADMIN_ACCESS
// ),
controller.create);

// Returns the threads associated with the entity specified.
router.get('/entity/:entityId',
// auth.canAccessEntity(
//     READ_ACCESS,
//     WRITE_ACCESS,
//     ADMIN_ACCESS
// ),
controller.indexByEntity);

// Patches the thread specified.
router.patch('/entity/:entityId/:id',
// auth.hasPermissionForEntityRelatedObject(Thread),
controller.patch);

// Deletes the thread specified.
router.delete('/entity/:entityId/:id',
// auth.canAccessEntity(
//     ADMIN_ACCESS
// ),
controller.destroy);

// Returns the number of messages for the thread specified.
router.get('/entity/:entityId/:id/messages/count',
// auth.canAccessEntity(
//     READ_ACCESS,
//     WRITE_ACCESS,
//     ADMIN_ACCESS
// ),
controller.messagesCount);

// Returns the messages for the thread specified.
router.get('/entity/:entityId/:id/messages',
// auth.canAccessEntity(
//     READ_ACCESS,
//     WRITE_ACCESS,
//     ADMIN_ACCESS
// ),
controller.indexMessages);

// Adds a message to the thread specified.
router.post('/entity/:entityId/:id/messages',
// auth.canAccessEntity(
//     READ_ACCESS,
//     WRITE_ACCESS,
//     ADMIN_ACCESS
// ),
controller.createMessage);

// Patches the message specified.
router.patch('/entity/:entityId/:id/messages/:messageId',
// auth.hasPermissionForEntityRelatedObject(Thread),
controller.patchMessage);

// Deletes the message specified.
router.delete('/entity/:entityId/:id/messages/:messageId',
// auth.canAccessEntity(
//     ADMIN_ACCESS
// ),
controller.destroyMessage);

module.exports = router;
