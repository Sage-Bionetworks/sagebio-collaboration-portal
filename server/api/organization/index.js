import { Router } from 'express';
import * as auth from '../../auth/auth.service';
import * as controller from './organization.controller';

var router = Router();

/**
 * @swagger
 * /organizations:
 *   get:
 *     tags:
 *       - Organizations
 *     summary: Returns all the Organizations.
 *     description: Returns all the Organizations.
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: An array of Organizations
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Organization'
 */
router.get('/', auth.isAuthenticated(), controller.index);

/**
 * @swagger
 * /organizations/{id}:
 *   get:
 *     tags:
 *       - Organizations
 *     summary: Gets an Organization by ID.
 *     description: Gets an Organization by ID.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Organization ID
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '200':
 *         description: An Organization
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Organization'
 *       '400':
 *         description: Invalid ID supplied
 *       '404':
 *         description: Organization not found
 */
router.get('/:id', auth.isAuthenticated(), controller.show);

/**
 * @swagger
 * /organizations:
 *   post:
 *     tags:
 *       - Organizations
 *     summary: Creates an Organization.
 *     description: Creates an Organization.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: The Organization to create
 *         schema:
 *           $ref: '#/components/schemas/Organization'
 *     responses:
 *       '201':
 *         description: The Organization created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Organization'
 *       '400':
 *         description: Invalid Organization
 */
router.post('/', auth.hasRole('Admin'), controller.create);

/**
 * @swagger
 * /organizations:
 *   patch:
 *     tags:
 *       - Organizations
 *     summary: Updates an Organization.
 *     description: Updates an Organization.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: The Organization to update
 *         schema:
 *           $ref: '#/components/schemas/Organization'
 *     responses:
 *       '201':
 *         description: The Organization updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Organization'
 *       '400':
 *         description: Invalid Organization supplied
 *       '404':
 *         description: Organization not found
 */
router.patch('/:id', auth.hasRole('Admin'), controller.patch);

/**
 * @swagger
 * /organizations/{id}:
 *   delete:
 *     tags:
 *       - Organizations
 *     summary: Deletes an Organization by ID.
 *     description: Deletes an Organization by ID.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the Organization that needs to be deleted
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '204':
 *         description: Organization successfully removed
 *       '400':
 *         description: Invalid Organization supplied
 *       '404':
 *         description: Organization not found
 */
router.delete('/:id', auth.hasRole('Admin'), controller.destroy);

module.exports = router;
