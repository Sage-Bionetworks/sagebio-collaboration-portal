import { Router } from 'express';
import * as auth from '../../auth/auth.service';
import * as actionPermissionAuth from './action-permission.auth';
import * as controller from './action-permission.controller';

var router = Router();

/**
 * @swagger
 * /action-permissions:
 *   get:
 *     tags:
 *       - ActionPermissions
 *     summary: Returns the ActionPermissions of the user.
 *     description: Returns the ActionPermissions of the user.
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: An array of ActionPermissions
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ActionPermission'
 */
router.get('/', auth.isAuthenticated(), controller.index);

/**
 * @swagger
 * /action-permissions/users/{userId}:
 *   get:
 *     tags:
 *       - ActionPermissions
 *     summary: Returns the ActionPermissions of the user specified.
 *     description: Returns the ActionPermissions of the user specified.
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: An array of ActionPermissions
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ActionPermission'
 */
router.get('/users/:userId', actionPermissionAuth.canReadActionPermission(), controller.indexByUser);

/**
 * @swagger
 * /action-permissions:
 *   post:
 *     tags:
 *       - ActionPermissions
 *     summary: Creates an ActionPermission.
 *     description: Creates an ActionPermission.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: The ActionPermission to create
 *         schema:
 *           $ref: '#/components/schemas/ActionPermission'
 *     responses:
 *       '201':
 *         description: The ActionPermission created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ActionPermission'
 *       '400':
 *         description: Invalid ActionPermission
 */
router.post('/', actionPermissionAuth.canCreateActionPermission(), controller.create);

/**
 * @swagger
 * /action-permissions/{id}:
 *   delete:
 *     tags:
 *       - ActionPermissions
 *     summary: Deletes an ActionPermission by ID.
 *     description: Deletes an ActionPermission by ID.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the ActionPermission that needs to be deleted
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '204':
 *         description: ActionPermission successfully removed
 *       '400':
 *         description: Invalid ActionPermission supplied
 *       '404':
 *         description: ActionPermission not found
 */
router.delete('/:id', actionPermissionAuth.canDeleteActionPermission(), controller.destroy);

module.exports = router;
