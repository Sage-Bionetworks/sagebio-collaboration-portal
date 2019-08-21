var express = require('express');
var controller = require('./thread.controller');
var auth = require('../../auth/auth.service');

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
), controller.createThread);

// Get all threads not associated with the entity specified.
// router.get('/entity/:entityId/threads', auth.hasPermissionForEntity(
//     READ_ACCESS,
//     WRITE_ACCESS,
//     ADMIN_ACCESS
// ), controller.indexThreads);

// Patch the thread specified
// Authorized if:
//   - user is a portal admin
//   - if the entity is a project or child of project (public or private), the user is an admin of this project
//   - if the user is the owned of the entity
// router.patch('/entity/:entityId/threads/:threadId', auth.isOwner(), controller.patchThread);


// Delete the thread specified.
// NOTE: Authorized if 1) the user is a portal admin OR 2) has ADMIN access to `:entityId` OR 3) is the owner of the thread.
// router.delete('/threads/:threadId', controller.destroyThread);

module.exports = router;
