var express = require('express');
var controller = require('./message.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

import {
    accessTypes,
} from '../../config/environment';
const ADMIN_ACCESS = accessTypes.ADMIN.value;
const READ_ACCESS = accessTypes.READ.value;
const WRITE_ACCESS = accessTypes.WRITE.value;

/**
 * Threads API
 */

 // NOTE: A Thread object is always expected to be associated to an Entity. This entity can be
 // a Project, an Insight (Memo, Report, etc.), a Resource (File, Dashboard, etc.), a Data Catalog,
 // a Tool. Maybe a Dataset in the future when we will have a unique ID for it. We could also have
 // threads associated to the app/portal (general question about the portal), in which case we would
 // probably need to add a model called App, create an App object that provides information about
 // the app (e.g. title) and store it in a DB collection. Threads about the app would then be
 // associated to the ID of the App object. If we want to support threads that are about nothing
 // modeled in the portal (not sure that this is requried), then the Entity ID associated to the
 // thread could be set to `null` or `undefined`.

// Associating a thread to an entity is required in order to know whether a user is authorized
// to have access and contribute to a discussion. For example, we don't want a user to be able
// to have access to the discussion about a Project, Memo, or Dashboard, for example, he/she
// doesn't have access to.

// Associating threads to an Entity can also provide a way to organize the threads that are
// available to a given user. For example, the discussion page available from the main navidation
// bar could be a place where a user can access all the threads he/she has access to. A search
// field would then allow to query only for the thread that include specific terms in their name
// or metadata.
// We could also have a filter menu that allows the user to filter threads by entity type. For example,
// the user could select `Tool` or `Data Catalog`. In the former case, the app would find all the
// Tools the user has access to, and then return the threads associated to this list of Tools.
// An additional filter menu could be provided to select a specific Tool name to show only the
// Thread associated to a specific Tool. A search filter could also be provided to filter the
// threads by Tool names, e.g. display all the threads associated to the Tools whose name include
// 'My RStudio Server', which could match `My RStudio Server #1` and `My RStudio Server #2`.
//
// As there are entities that are always associated to project, for example Insights (e.g. Memo,
// Report) and Resoures (e.g. State, Dashboard, etc), we could also filter threads by Project
// on the page available from the main navidation bar and make it so that the threads returned
// are either associated directly to a given Project OR associated to Insights/Resources that
// are themselves associated to the Project.


// Creates a new thread associated to the entity specified.
// NOTE: Authorized if 1) the user is a portal admin OR 2) has ADMIN access to `:entityId`
// NOTE: We need to check that the value `:entityId` match the value `entityId` in the posted object.
// NOTE: For security measure, we may also need to check entityType as the same ID could be
//       included in two DB collections, e.g. Projects and Memo collections.
router.post('/entity/:entityId/threads', auth.hasPermissionForEntity(
    READ_ACCESS,
    WRITE_ACCESS,
    ADMIN_ACCESS
), controller.createThread);

// Get all threads not associated with the entity specified.
// NOTE: Authorized if 1) the user is a portal admin OR 2) has ADMIN access to `:entityId`
router.get('/entity/:entityId/threads', auth.hasPermissionForEntity(
    READ_ACCESS,
    WRITE_ACCESS,
    ADMIN_ACCESS
), controller.indexThreads);

// Patch the thread specified
// NOTE: Authorized if 1) the user is a portal admin OR 2) has ADMIN access to `:entityId` OR 3) is the owner of the thread.
router.patch('/entity/:entityId/threads/:threadId', controller.patchThread);


// Delete the thread specified.
// NOTE: Authorized if 1) the user is a portal admin OR 2) has ADMIN access to `:entityId` OR 3) is the owner of the thread.
router.delete('/threads/:threadId', controller.destroyThread);


/**
 * Messages API
 */

// [x] Specific thread not associated with an entity
// router.post('/threads/:id', auth.isAuthenticated(), controller.addMessageToThread);










// // GET /messages/threads/messages/:id - Messages for a specific thread not associated with an entity
// router.get('/threads/messages/:id', auth.isAuthenticated(), controller.showMessagesForThread);

// // TODO Create a route to DELETE a message in a public thread
// // TODO Do not allow the original message of a public thread to be deleted if there are replies from other users
// // TODO Owners of a message in a public thread may delete
// // TODO Portal admin users can delete messages

// // GET /messages/threads/entity/:entityId - All threads for an entity
// router.get('/threads/entity/:entityId', auth.hasPermissionForEntity([READ_ACCESS, WRITE_ACCESS, ADMIN_ACCESS]), controller.indexThreadsForEntity);

// // VERIFY how posting to our shared endpoint handles creating threads for entities
// // NOTE Current behavior simply posts to our existing endpoint for creating a public thread and adds an entityId and entityType behind the scenes...should we create a new route?
// // TODO (?) Create a route to POST a new thread for portal admins or entity read/write/admin users

// // VERIFY how posting to our shared endpoint handles creating messages for entity threads
// // NOTE Current behavior simply posts to our existing endpoint for adding a new message to an entity thread...should we create a new route?
// // TODO (?) Create a route to POST a new message to an entity thread for portal admins or entity read/write/admin users

// // TODO Create a route to PATCH a specific message in a thread for an entity
// // TODO Only allow owners to edit their own titles for an entity thread
// // TODO Only allow owners to edit their own messages for an entity thread

// // TODO Create a route to DELETE a specific threadId for an entity
// // TODO Portal admin users and entity admin users may delete

// // TODO Create a route to DELETE a specific message for an entity thread
// // TODO Do not allow the original message of a thread to be deleted
// // TODO Owners of a message in an entity thread may delete
// // TODO Portal admin users or entity admin users can delete messages

// /**
//  * @swagger
//  * /messages:
//  *   get:
//  *     tags:
//  *       - Messages
//  *     summary: Returns all the Messages.
//  *     description: Returns all the Messages.
//  *     produces:
//  *       - application/json
//  *     responses:
//  *       '200':
//  *         description: An array of Messages
//  *         schema:
//  *           type: array
//  *           items:
//  *             $ref: '#/components/schemas/Message'
//  */
// router.get('/', controller.index);

// /**
//  * @swagger
//  * /messages/{id}:
//  *   get:
//  *     tags:
//  *       - Messages
//  *     summary: Gets a Message by ID.
//  *     description: Gets a Message by ID.
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - name: id
//  *         in: path
//  *         description: Message ID
//  *         required: true
//  *         schema:
//  *           type: string
//  *           format: uuid
//  *     responses:
//  *       '200':
//  *         description: A Message
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Message'
//  *       '400':
//  *         description: Invalid ID supplied
//  *       '404':
//  *         description: Message not found
//  */
// router.get('/:id', controller.show);

// /**
//  * @swagger
//  * /messages:
//  *   post:
//  *     tags:
//  *       - Messages
//  *     summary: Creates a Message.
//  *     description: Creates a Message.
//  *     parameters:
//  *       - in: body
//  *         name: body
//  *         required: true
//  *         description: The Message to create
//  *         schema:
//  *           $ref: '#/components/schemas/Message'
//  *     responses:
//  *       '201':
//  *         description: The Message created
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Message'
//  *       '400':
//  *         description: Invalid Message
//  */
// router.post('/', auth.isAuthenticated(), controller.create);

// /**
//  * @swagger
//  * /messages:
//  *   patch:
//  *     tags:
//  *       - Messages
//  *     summary: Updates a Message.
//  *     description: Updates a Message.
//  *     parameters:
//  *       - in: body
//  *         name: body
//  *         required: true
//  *         description: The patches to apply
//  *         schema:
//  *           type: array
//  *           $ref: '#/components/schemas/Patch'
//  *     responses:
//  *       '201':
//  *         description: The Message updated
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Message'
//  *       '400':
//  *         description: Invalid Message supplied
//  *       '404':
//  *         description: Message not found
//  */
// // TODO Only message owners can edit an existing message
// router.patch('/:id', controller.patch);

// /**
//  * @swagger
//  * /messages/{id}:
//  *   delete:
//  *     tags:
//  *       - Messages
//  *     summary: Deletes a Message by ID.
//  *     description: Deletes a Message by ID.
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - name: id
//  *         in: path
//  *         description: ID of the Message that needs to be deleted
//  *         required: true
//  *         schema:
//  *           type: string
//  *           format: uuid
//  *     responses:
//  *       '204':
//  *         description: Message successfully removed
//  *       '400':
//  *         description: Invalid Message supplied
//  *       '404':
//  *         description: Message not found
//  */
// // TODO Do not allow first message of a thread to be deleted
// router.delete('/:id', controller.destroy);

// /**
//  * @swagger
//  * /messages/{id}/star:
//  *   post:
//  *     tags:
//  *       - Messages
//  *     summary: Stars a Message.
//  *     description: Stars a Message.
//  *     parameters:
//  *       - name: id
//  *         in: path
//  *         description: ID of the Message to star
//  *         required: true
//  *         schema:
//  *           type: string
//  *           format: uuid
//  *     responses:
//  *       '201':
//  *         description: Message successfully starred
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/MessageStar'
//  *       '400':
//  *         description: Invalid Message
//  */
// router.post('/:id/star', auth.isAuthenticated(), controller.star);

// /**
//  * @swagger
//  * /messages/{id}/unstar:
//  *   delete:
//  *     tags:
//  *       - Messages
//  *     summary: Unstars a Message.
//  *     description: Unstars a Message.
//  *     parameters:
//  *       - name: id
//  *         in: path
//  *         description: ID of the Message to star
//  *         required: true
//  *         schema:
//  *           type: string
//  *           format: uuid
//  *     responses:
//  *       '204':
//  *         description: Message successfully unstarred
//  *       '400':
//  *         description: Invalid Message ID supplied
//  *       '404':
//  *         description: Message not found
//  */
// router.delete('/:id/unstar', auth.isAuthenticated(), controller.unstar);

// /**
//  * @swagger
//  * /tools/{id}/stars/count:
//  *   get:
//  *     tags:
//  *       - Messages
//  *     summary: Returns the number of Users who have starred this Message.
//  *     description: Returns the number of Users who have starred this Message.
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - name: id
//  *         in: path
//  *         description: Message ID
//  *         required: true
//  *         schema:
//  *           type: string
//  *           format: uuid
//  *     responses:
//  *       '200':
//  *         description:  Number of Users who have starred this Message
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/NumberValue'
//  *       '400':
//  *         description: Invalid Message ID supplied
//  *       '404':
//  *         description: Message not found
//  */
// router.get('/:id/stars/count', controller.starsCount);

// /**
//  * @swagger
//  * /messages/stars/mine:
//  *   get:
//  *     tags:
//  *       - Messages
//  *     summary: Returns my Message Stars.
//  *     description: Returns my Message Stars.
//  *     parameters:
//  *       - name: id
//  *         in: path
//  *         description: Message ID
//  *         required: true
//  *         schema:
//  *           type: string
//  *           format: uuid
//  *     responses:
//  *       '200':
//  *         description: An array of Message Stars
//  *         schema:
//  *           type: array
//  *           items:
//  *             $ref: '#/components/schemas/MessageStar'
//  */
// router.get('/stars/mine', auth.isAuthenticated(), controller.indexMyStars);

// /**
//  * @swagger
//  * /messages/{id}/star/archive:
//  *   patch:
//  *     tags:
//  *       - Messages
//  *     summary: Archives a Message Star.
//  *     description: Archives a Message Star.
//  *     parameters:
//  *       - name: id
//  *         in: path
//  *         description: Message ID
//  *         required: true
//  *         schema:
//  *           type: string
//  *           format: uuid
//  *     responses:
//  *       '201':
//  *         description: The Message Star is archived
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/MessageStar'
//  *       '400':
//  *         description: Invalid Message ID supplied
//  *       '404':
//  *         description: Message not found
//  */
// router.patch('/:id/star/archive', auth.isAuthenticated(), controller.archiveStar);

// /**
//  * @swagger
//  * /messages/{id}/star/unarchive:
//  *   patch:
//  *     tags:
//  *       - Messages
//  *     summary: Unarchives a Message Star.
//  *     description: Unarchives a Message Star.
//  *     parameters:
//  *       - name: id
//  *         in: path
//  *         description: Message ID
//  *         required: true
//  *         schema:
//  *           type: string
//  *           format: uuid
//  *     responses:
//  *       '201':
//  *         description: The Message Star is unarchived
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/MessageStar'
//  *       '400':
//  *         description: Invalid Message ID supplied
//  *       '404':
//  *         description: Message not found
//  */
// router.patch('/:id/star/unarchive', auth.isAuthenticated(), controller.unarchiveStar);

// /**
//  * @swagger
//  * /messages/{id}/replies:
//  *   get:
//  *     tags:
//  *       - Messages
//  *     summary: Returns the replies to a Message.
//  *     description: Returns the replies to a Message.
//  *     parameters:
//  *       - name: id
//  *         in: path
//  *         description: Message ID
//  *         required: true
//  *         schema:
//  *           type: string
//  *           format: uuid
//  *     responses:
//  *       '200':
//  *         description: An array of Message.
//  *         schema:
//  *           type: array
//  *           items:
//  *             $ref: '#/components/schemas/Message'
//  */
// router.get('/:id/replies', controller.indexReplies);

module.exports = router;
