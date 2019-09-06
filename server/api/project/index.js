var express = require('express');
var controller = require('./project.controller');
var auth = require('../../auth/auth.service');
var projectAuth = require('./project.auth');

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
router.get('/:id', projectAuth.canReadProject(), controller.show);

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
router.post('/', projectAuth.canCreateProject(), controller.create);

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
router.patch('/:id', projectAuth.canEditProject(), controller.patch);

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
router.delete('/:id', projectAuth.canDeleteProject(), controller.destroy);

/**
 * @swagger
 * /projects/{id}/visibility:
 *   get:
 *     tags:
 *       - Projects
 *     summary: Returns the visibility of the project.
 *     description: Returns the visibility of the project.
 *     produces:
 *       - text/plain
 *     responses:
 *       '200':
 *         description: The visibility of the Project
 *         content:
 *           text/plain:
 *             schema:
 *               $ref: '#/components/schemas/EntityVisibility'
 */
router.get('/:id/visibility', auth.isAuthenticated(), controller.showVisibility);

/**
 * @swagger
 * /projects/{id}/visibility/public:
 *   patch:
 *     tags:
 *       - Projects
 *     summary: Makes the project public.
 *     description: Makes the project public.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: An empty array
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
router.patch('/:id/visibility/public', projectAuth.canEditProject(), controller.makePublic);

/**
 * @swagger
 * /projects/{id}/visibility/private:
 *   patch:
 *     tags:
 *       - Projects
 *     summary: Makes the project private.
 *     description: Makes the project private.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: An empty array
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
router.patch('/:id/visibility/private', projectAuth.canEditProject(), controller.makePrivate);

module.exports = router;
