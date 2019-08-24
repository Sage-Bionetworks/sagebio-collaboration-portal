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

// Creates a new thread associated to the entity specified.
router.post('/entity/:entityId', auth.hasPermissionForEntity(
    READ_ACCESS,
    WRITE_ACCESS,
    ADMIN_ACCESS
), controller.create);

// Returns the threads associated with the entity specified.
router.get('/entity/:entityId', auth.hasPermissionForEntity(
    READ_ACCESS,
    WRITE_ACCESS,
    ADMIN_ACCESS
), controller.indexByEntity);

// Patches the thread specified.
router.patch('/entity/:entityId/:id', auth.hasPermissionForEntityRelatedObject(Thread), controller.patch);

// Deletes the thread specified.
router.delete('/entity/:entityId/:id', auth.hasPermissionForEntity(
    ADMIN_ACCESS
), controller.destroy);

// Returns the number of messages for the thread specified.
router.get('/entity/:entityId/:id/messages/count', auth.hasPermissionForEntity(
    READ_ACCESS,
    WRITE_ACCESS,
    ADMIN_ACCESS
), controller.messagesCount);

// Adds a message to the thread specified.
router.post('/entity/:entityId/:id/messages', auth.hasPermissionForEntity(
    READ_ACCESS,
    WRITE_ACCESS,
    ADMIN_ACCESS
), controller.createMessage);

module.exports = router;
