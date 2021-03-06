import { Router } from 'express';
import * as auth from '../../auth/auth.service';
import * as userAuth from './user.auth';
import * as controller from './user.controller';

var router = Router();

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Returns all the Users.
 *     description: Returns all the Users.
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: An array of UserProfiles
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/UserProfile'
 *       '401':
 *         $ref: '#/components/responses/UnauthorizedError'
 *     security:
 *       - BearerAuth: []
 */
router.get('/', auth.isAuthenticated(), controller.index);

/**
 * @swagger
 * /users/me:
 *   get:
 *     tags:
 *       - Users
 *     summary: Gets my User data.
 *     description: Gets my User data (based on the authentication token received).
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: A User
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         description: Invalid ID supplied
 *       '404':
 *         description: User not found
 */
router.get('/me', auth.isAuthenticated(), controller.me);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Gets a User by ID.
 *     description: Gets a User by ID.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A UserProfile
 *         content:
 *           application/json:
 *         schema:
 *           $ref: '#/components/schemas/UserProfile'
 *       '400':
 *         description: Invalid ID supplied
 *       '404':
 *         description: User not found
 */
router.get('/:id', auth.isAuthenticated(), controller.show);

/**
 * @swagger
 * /users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Creates a User.
 *     description: Creates a User.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: The User to create
 *         schema:
 *           $ref: '#/components/schemas/User'
 *     responses:
 *       '201':
 *         description: User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenResponse'
 *       '400':
 *         description: Invalid User
 */
router.post('/', userAuth.canCreateUser(), controller.create);

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Updates a User.
 *     description: Updates a User.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: The User to update
 *         schema:
 *           $ref: '#/components/schemas/User'
 *     responses:
 *       '201':
 *         description: The User updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         description: Invalid User supplied
 *       '404':
 *         description: User not found
 */
router.patch('/:id', userAuth.canEditUser(), controller.patch);

/**
 * swagger  // DISABLE
 * /users/{id}/password:
 *   put:
 *     tags:
 *       - Users
 *     summary: Changes the password of a User.
 *     description: Changes the password of a User.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         description: User ID
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: body
 *         required: true
 *         description: The old and new passowrd
 *         schema:
 *           type: object
 *           properties:
 *             oldPassword:
 *               type: string
 *             newPassword:
 *               type: string
 *     responses:
 *       '204':
 *         description: Password successfully updated
 *       '400':
 *         description: Invalid ID supplied
 *       '404':
 *         description: User not found
 */
router.put('/:id/password', userAuth.canEditUser(), controller.changePassword);

/**
 * swagger
 * /users/{id}/role:
 *   put:
 *     tags:
 *       - Users
 *     summary: Changes the role of a User.
 *     description: Changes the role of a User.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         description: User ID
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: body
 *         required: true
 *         description: The new role
 *         schema:
 *           type: object
 *           properties:
 *             newRole:
 *               type: string
 *     responses:
 *       '204':
 *         description: Role successfully updated
 *       '404':
 *         description: User not found
 */
router.put('/:id/role', userAuth.canChangeRole(), controller.changeRole);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Deletes a User by ID.
 *     description: Deletes a User by ID.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the User that needs to be deleted
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: User successfully removed
 *       '400':
 *         description: Invalid User supplied
 *       '404':
 *         description: User not found
 */
router.delete('/:id', userAuth.canDeleteUser(), controller.destroy);

module.exports = router;
