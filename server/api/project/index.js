var express = require('express');
var controller = require('./project.controller');
var auth = require('../../auth/auth.service');
import {
    accessTypes,
    userRoles
} from '../../config/environment';

const ADMIN_ROLE = userRoles.ADMIN.value;
const READ_ACCESS = accessTypes.READ.value;
const WRITE_ACCESS = accessTypes.WRITE.value;
const ADMIN_ACCESS = accessTypes.ADMIN.value;

var router = express.Router();

/**
 * @swagger
 * /projects:
 *   get:
 *     tags:
 *       - Projects
 *     summary: Returns the Projects visible to the user.
 *     description: Returns the Projects visible to the user.
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: An array of Projects
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Project'
 */
router.get('/', auth.isAuthenticated(), controller.index);

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     tags:
 *       - Projects
 *     summary: Gets a Project by ID.
 *     description: Gets a Project by ID.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Project ID
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '200':
 *         description: A Project
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       '400':
 *         description: Invalid ID supplied
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Project not found
 */
router.get('/:id', auth.hasPermissionForEntity([
    READ_ACCESS,
    WRITE_ACCESS,
    ADMIN_ACCESS
]), controller.show);

/**
 * @swagger
 * /projects:
 *   post:
 *     tags:
 *       - Projects
 *     summary: Creates a Project.
 *     description: Creates a Project.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: The Project to create
 *         schema:
 *           $ref: '#/components/schemas/Project'
 *     responses:
 *       '201':
 *         description: The Project created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       '400':
 *         description: Invalid Project
 */
router.post('/', auth.isAuthenticated(), controller.create);

/**
 * @swagger
 * /projects:
 *   patch:
 *     tags:
 *       - Projects
 *     summary: Updates a Project.
 *     description: Updates a Project.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: The Project to update
 *         schema:
 *           $ref: '#/components/schemas/Project'
 *     responses:
 *       '201':
 *         description: The Project updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       '400':
 *         description: Invalid Project supplied
 *       '404':
 *         description: Project not found
 */
router.patch('/:id', auth.hasPermissionForEntity([
    ADMIN_ACCESS
]), controller.patch);

/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     tags:
 *       - Projects
 *     summary: Deletes a Project by ID.
 *     description: Deletes a Project by ID.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the Project that needs to be deleted
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '204':
 *         description: Project successfully removed
 *       '400':
 *         description: Invalid Project supplied
 *       '404':
 *         description: Project not found
 */
// router.delete('/:id', auth.hasPermissionForEntity([
//     ADMIN_ACCESS
// ]), controller.destroy);

module.exports = router;
