var express = require('express');
var controller = require('./message.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

/**
 * @swagger
 * /messages:
 *   get:
 *     tags:
 *       - Messages
 *     summary: Returns all the Messages.
 *     description: Returns all the Messages.
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: An array of Messages
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Message'
 */
router.get('/', controller.index);

/**
 * @swagger
 * /messages/{id}:
 *   get:
 *     tags:
 *       - Messages
 *     summary: Gets a Message by ID.
 *     description: Gets a Message by ID.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Message ID
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '200':
 *         description: A Message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       '400':
 *         description: Invalid ID supplied
 *       '404':
 *         description: Message not found
 */
router.get('/:id', controller.show);

/**
 * @swagger
 * /messages:
 *   post:
 *     tags:
 *       - Messages
 *     summary: Creates a Message.
 *     description: Creates a Message.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: The Message to create
 *         schema:
 *           $ref: '#/components/schemas/Message'
 *     responses:
 *       '201':
 *         description: The Message created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       '400':
 *         description: Invalid Message
 */
router.post('/', auth.isAuthenticated(), controller.create);

/**
 * @swagger
 * /messages:
 *   patch:
 *     tags:
 *       - Messages
 *     summary: Updates a Message.
 *     description: Updates a Message.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: The patches to apply
 *         schema:
 *           type: array
 *           $ref: '#/components/schemas/Patch'
 *     responses:
 *       '201':
 *         description: The Message updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       '400':
 *         description: Invalid Message supplied
 *       '404':
 *         description: Message not found
 */
router.patch('/:id', controller.patch);

/**
 * @swagger
 * /messages/{id}:
 *   delete:
 *     tags:
 *       - Messages
 *     summary: Deletes a Message by ID.
 *     description: Deletes a Message by ID.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the Message that needs to be deleted
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '204':
 *         description: Message successfully removed
 *       '400':
 *         description: Invalid Message supplied
 *       '404':
 *         description: Message not found
 */
router.delete('/:id', controller.destroy);

/**
 * @swagger
 * /messages/{id}/star:
 *   post:
 *     tags:
 *       - Messages
 *     summary: Stars a Message.
 *     description: Stars a Message.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the Message to star
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '201':
 *         description: Message successfully starred
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageStar'
 *       '400':
 *         description: Invalid Message
 */
router.post('/:id/star', auth.isAuthenticated(), controller.star);

/**
 * @swagger
 * /messages/{id}/unstar:
 *   delete:
 *     tags:
 *       - Messages
 *     summary: Unstars a Message.
 *     description: Unstars a Message.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the Message to star
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '204':
 *         description: Message successfully unstarred
 *       '400':
 *         description: Invalid Message ID supplied
 *       '404':
 *         description: Message not found
 */
router.delete('/:id/unstar', auth.isAuthenticated(), controller.unstar);

/**
 * @swagger
 * /tools/{id}/stars/count:
 *   get:
 *     tags:
 *       - Messages
 *     summary: Returns the number of Users who have starred this Message.
 *     description: Returns the number of Users who have starred this Message.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Message ID
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '200':
 *         description:  Number of Users who have starred this Message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NumberValue'
 *       '400':
 *         description: Invalid Message ID supplied
 *       '404':
 *         description: Message not found
 */
router.get('/:id/stars/count', controller.starsCount);

/**
 * @swagger
 * /messages/stars/mine:
 *   get:
 *     tags:
 *       - Messages
 *     summary: Returns my Message Stars.
 *     description: Returns my Message Stars.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Message ID
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '200':
 *         description: An array of Message Stars
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/MessageStar'
 */
router.get('/stars/mine', auth.isAuthenticated(), controller.indexMyStars);

/**
 * @swagger
 * /messages/{id}/star/archive:
 *   patch:
 *     tags:
 *       - Messages
 *     summary: Archives a Message Star.
 *     description: Archives a Message Star.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Message ID
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '201':
 *         description: The Message Star is archived
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageStar'
 *       '400':
 *         description: Invalid Message ID supplied
 *       '404':
 *         description: Message not found
 */
router.patch('/:id/star/archive', auth.isAuthenticated(), controller.archiveStar);

/**
 * @swagger
 * /messages/{id}/star/unarchive:
 *   patch:
 *     tags:
 *       - Messages
 *     summary: Unarchives a Message Star.
 *     description: Unarchives a Message Star.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Message ID
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '201':
 *         description: The Message Star is unarchived
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageStar'
 *       '400':
 *         description: Invalid Message ID supplied
 *       '404':
 *         description: Message not found
 */
router.patch('/:id/star/unarchive', auth.isAuthenticated(), controller.unarchiveStar);

/**
 * @swagger
 * /messages/{id}/replies:
 *   get:
 *     tags:
 *       - Messages
 *     summary: Returns the replies to a Message.
 *     description: Returns the replies to a Message.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Message ID
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '200':
 *         description: An array of Message.
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Message'
 */
router.get('/:id/replies', controller.indexReplies);

module.exports = router;
