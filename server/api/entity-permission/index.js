import { Router } from 'express';
import * as auth from '../../auth/auth.service';
import * as entityPermissionAuth from './entity-permission.auth';
import * as controller from './entity-permission.controller';

var router = Router();

/**
 * @swagger
 * /entity-permissions:
 *   get:
 *     tags:
 *       - Entity permissions
 *     summary: Returns the EntityPermissions of the user.
 *     description: Returns the EntityPermissions of the user.
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: An array of EntityPermission
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/EntityPermission'
 */
router.get('/', auth.isAuthenticated(), controller.index);

/**
 * @swagger
 * /entity-permissions/{id}:
 *   get:
 *     tags:
 *       - Entity permissions
 *     summary: Gets a EntityPermission by ID.
 *     description: Gets a EntityPermission by ID.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: EntityPermission ID
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '200':
 *         description: A EntityPermission
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EntityPermission'
 *       '400':
 *         description: Invalid ID supplied
 *       '404':
 *         description: EntityPermission not found
 */
router.get('/:id', auth.isAuthenticated(), controller.show);

/**
 * @swagger
 * /entity-permissions/entity/{entityId}:
 *   get:
 *     tags:
 *       - Entity permissions
 *     summary: Returns the EntityPermissions for the entity specified.
 *     description: Returns the EntityPermissions for the entity specified.
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: An array of EntityPermissions
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/EntityPermission'
 */
router.get('/entity/:entityId', auth.isAuthenticated(), controller.indexByEntity);

/**
 * @swagger
 * /entity-permissions:
 *   post:
 *     tags:
 *       - Entity permissions
 *     summary: Creates an EntityPermissions.
 *     description: Creates an EntityPermissions.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: The EntityPermission to create
 *         schema:
 *           $ref: '#/components/schemas/EntityPermission'
 *     responses:
 *       '201':
 *         description: The EntityPermission created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EntityPermission'
 *       '400':
 *         description: Invalid EntityPermission
 */
router.post('/', entityPermissionAuth.canCreateEntityPermission(), controller.create);

/**
 * @swagger
 * /entity-permissions/{id}:
 *   patch:
 *     tags:
 *       - Entity permissions
 *     summary: Updates a EntityPermission.
 *     description: Updates a EntityPermission.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: The EntityPermission to update
 *         schema:
 *           $ref: '#/components/schemas/EntityPermission'
 *     responses:
 *       '201':
 *         description: The EntityPermission updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EntityPermission'
 *       '400':
 *         description: Invalid EntityPermission supplied
 *       '404':
 *         description: EntityPermission not found
 */
router.patch('/:id', entityPermissionAuth.canEditEntityPermission(), controller.patch);

/**
 * @swagger
 * /entity-permissions/{id}:
 *   delete:
 *     tags:
 *       - Entity permissions
 *     summary: Deletes an EntityPermission by ID.
 *     description: Deletes an EntityPermission by ID.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the EntityPermission that needs to be deleted
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '204':
 *         description: EntityPermission successfully removed
 *       '400':
 *         description: Invalid EntityPermission supplied
 *       '404':
 *         description: EntityPermission not found
 */
router.delete('/:id', entityPermissionAuth.canDeleteEntityPermission(), controller.destroy);

module.exports = router;
