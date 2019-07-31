var express = require('express');
var controller = require('./thread.controller');
var auth = require('../../auth/auth.service');

import {
    accessTypes,
} from '../../config/environment';
const ADMIN_ACCESS = accessTypes.ADMIN.value;
const READ_ACCESS = accessTypes.READ.value;
const WRITE_ACCESS = accessTypes.WRITE.value;

var router = express.Router();

/**
 * @swagger
 * /threads:
 *   get:
 *     tags:
 *       - Threads
 *     summary: Returns all the Threads.
 *     description: Returns all the Threads.
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: An array of Threads
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Thread'
 */
router.get('/', auth.isAuthenticated(), controller.index);

/**
 * @swagger
 * /threads/{id}:
 *   get:
 *     tags:
 *       - Threads
 *     summary: Gets a Thread by ID.
 *     description: Gets a Thread by ID.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Thread ID
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '200':
 *         description: A Thread
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Thread'
 *       '400':
 *         description: Invalid ID supplied
 *       '404':
 *         description: Thread not found
 */
router.get('/:id', auth.isAuthenticated(), controller.show);

/**
 * @swagger
 * /threads:
 *   post:
 *     tags:
 *       - Threads
 *     summary: Creates a Thread.
 *     description: Creates a Thread.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: The Thread to create
 *         schema:
 *           $ref: '#/components/schemas/Thread'
 *     responses:
 *       '201':
 *         description: The Thread created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Thread'
 *       '400':
 *         description: Invalid Thread
 */
router.post('/', auth.isAuthenticated(), controller.create);

/**
 * @swagger
 * /threads:
 *   patch:
 *     tags:
 *       - Threads
 *     summary: Updates a Thread.
 *     description: Updates a Thread.
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
 *         description: The Thread updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Thread'
 *       '400':
 *         description: Invalid Thread supplied
 *       '404':
 *         description: Thread not found
 */
router.patch('/:id', auth.isAuthenticated(), controller.patch);

/**
 * @swagger
 * /threads/{id}:
 *   delete:
 *     tags:
 *       - Threads
 *     summary: Deletes a Thread by ID.
 *     description: Deletes a Thread by ID.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the Thread that needs to be deleted
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '204':
 *         description: Thread successfully removed
 *       '400':
 *         description: Invalid Thread supplied
 *       '404':
 *         description: Thread not found
 */
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

/**
 * @swagger
 * /threads/{id}/star:
 *   post:
 *     tags:
 *       - Threads
 *     summary: Stars a Thread.
 *     description: Stars a Thread.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the Thread to star
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '201':
 *         description: Thread successfully starred
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ThreadStar'
 *       '400':
 *         description: Invalid Thread
 */
router.post('/:id/star', auth.isAuthenticated(), controller.star);

/**
 * @swagger
 * /threads/{id}/unstar:
 *   delete:
 *     tags:
 *       - Threads
 *     summary: Unstars a Thread.
 *     description: Unstars a Thread.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the Thread to star
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '204':
 *         description: Thread successfully unstarred
 *       '400':
 *         description: Invalid Thread ID supplied
 *       '404':
 *         description: Thread not found
 */
router.delete('/:id/unstar', auth.isAuthenticated(), controller.unstar);

/**
 * @swagger
 * /tools/{id}/stars/count:
 *   get:
 *     tags:
 *       - Threads
 *     summary: Returns the number of Users who have starred this Thread.
 *     description: Returns the number of Users who have starred this Thread.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Thread ID
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '200':
 *         description:  Number of Users who have starred this Thread
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NumberValue'
 *       '400':
 *         description: Invalid Thread ID supplied
 *       '404':
 *         description: Thread not found
 */
router.get('/:id/stars/count', controller.starsCount);

/**
 * @swagger
 * /threads/stars/mine:
 *   get:
 *     tags:
 *       - Threads
 *     summary: Returns my Thread Stars.
 *     description: Returns my Thread Stars.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Thread ID
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '200':
 *         description: An array of Thread Stars
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ThreadStar'
 */
router.get('/stars/mine', auth.isAuthenticated(), controller.indexMyStars);

/**
 * @swagger
 * /threads/{id}/star/archive:
 *   patch:
 *     tags:
 *       - Threads
 *     summary: Archives a Thread Star.
 *     description: Archives a Thread Star.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Thread ID
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '201':
 *         description: The Thread Star is archived
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ThreadStar'
 *       '400':
 *         description: Invalid Thread ID supplied
 *       '404':
 *         description: Thread not found
 */
router.patch('/:id/star/archive', auth.isAuthenticated(), controller.archiveStar);

/**
 * @swagger
 * /threads/{id}/star/unarchive:
 *   patch:
 *     tags:
 *       - Threads
 *     summary: Unarchives a Thread Star.
 *     description: Unarchives a Thread Star.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Thread ID
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '201':
 *         description: The Thread Star is unarchived
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ThreadStar'
 *       '400':
 *         description: Invalid Thread ID supplied
 *       '404':
 *         description: Thread not found
 */
router.patch('/:id/star/unarchive', auth.isAuthenticated(), controller.unarchiveStar);

/**
 * @swagger
 * /threads/{id}/replies:
 *   get:
 *     tags:
 *       - Threads
 *     summary: Returns the replies to a Thread.
 *     description: Returns the replies to a Thread.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Thread ID
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '200':
 *         description: An array of Thread.
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Thread'
 */
router.get('/:id/replies', controller.indexReplies);

/**
 *
 */
router.get('/entity/:entityId', auth.hasPermissionForEntity([READ_ACCESS, WRITE_ACCESS, ADMIN_ACCESS]), controller.indexByEntity);

module.exports = router;
