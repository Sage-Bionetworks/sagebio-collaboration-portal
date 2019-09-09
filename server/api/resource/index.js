import { Router } from 'express';
import * as auth from '../../auth/auth.service';
import * as resourceAuth from './resource.auth';
import * as controller from './resource.controller';

var router = Router();

/**
 * @swagger
 * /resources:
 *   get:
 *     tags:
 *       - Resources
 *     summary: Returns the Resources visible to the user.
 *     description: Returns the Resources visible to the user.
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: An array of Resources
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Resource'
 */
router.get('/', auth.isAuthenticated(), controller.index);

/**
 * @swagger
 * /resources/{id}:
 *   get:
 *     tags:
 *       - Resources
 *     summary: Gets a Resource by ID.
 *     description: Gets a Resource by ID.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Resource ID
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '200':
 *         description: A Resource
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Resource'
 *       '400':
 *         description: Invalid ID supplied
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Resource not found
 */
router.get('/:id', resourceAuth.canReadResource(), controller.show);

/**
 * @swagger
 * /resources:
 *   post:
 *     tags:
 *       - Resources
 *     summary: Creates a Resource.
 *     description: Creates a Resource.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: The Resource to create
 *         schema:
 *           $ref: '#/components/schemas/Resource'
 *     responses:
 *       '201':
 *         description: The Resource created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Resource'
 *       '400':
 *         description: Invalid Resource
 */
router.post('/', resourceAuth.canCreateResource(), controller.create);

/**
 * @swagger
 * /resources/{id}:
 *   patch:
 *     tags:
 *       - Resources
 *     summary: Updates a Resource.
 *     description: Updates a Resource.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: The Resource to update
 *         schema:
 *           $ref: '#/components/schemas/Resource'
 *     responses:
 *       '201':
 *         description: The Resource updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Resource'
 *       '400':
 *         description: Invalid Resource supplied
 *       '404':
 *         description: Resource not found
 */
router.patch('/:id', resourceAuth.canEditResource(), controller.patch);

/**
 * @swagger
 * /resources/{id}:
 *   delete:
 *     tags:
 *       - Resources
 *     summary: Deletes a Resource by ID.
 *     description: Deletes a Resource by ID.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the Resource that needs to be deleted
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '204':
 *         description: Resource successfully removed
 *       '400':
 *         description: Invalid Resource supplied
 *       '404':
 *         description: Resource not found
 */
router.delete('/:id', resourceAuth.canDeleteResource(), controller.destroy);

module.exports = router;
