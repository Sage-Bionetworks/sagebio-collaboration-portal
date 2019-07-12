var express = require('express');
var controller = require('./project.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

/**
 * @swagger
 * /projects:
 *   get:
 *     tags:
 *       - Projects
 *     summary: Returns all the Projects.
 *     description: Returns all the Projects.
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
router.get('/', controller.index);

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
 *       '404':
 *         description: Project not found
 */
router.get('/:id', controller.show);

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
 *   put:
 *     tags:
 *       - Projects
 *     summary: Upserts a Project in the DB at the specified ID.
 *     description: Upserts a Project in the DB at the specified ID.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: The Project to upsert
 *         schema:
 *           $ref: '#/components/schemas/Project'
 *     responses:
 *       '201':
 *         description: The Project upserted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       '400':
 *         description: Invalid Project supplied
 *       '404':
 *         description: Project not found
 */
router.put('/:id', controller.upsert);

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
router.patch('/:id', controller.patch);

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
router.delete('/:id', controller.destroy);

module.exports = router;
