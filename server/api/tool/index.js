var express = require('express');
var controller = require('./tool.controller');

var router = express.Router();

/**
 * @swagger
 * /tools:
 *   get:
 *     tags:
 *       - Tools
 *     summary: Returns all the Tools.
 *     description: Returns all the Tools.
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: An array of Tools
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Tool'
 */
router.get('/', controller.index);

/**
 * @swagger
 * /tools/{id}:
 *   get:
 *     tags:
 *       - Tools
 *     summary: Gets a Tool by ID.
 *     description: Gets a Tool by ID.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Tool ID
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '200':
 *         description: A Tool
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tool'
 *       '400':
 *         description: Invalid ID supplied
 *       '404':
 *         description: Tool not found
 */
router.get('/:id', controller.show);

/**
 * @swagger
 * /tools:
 *   post:
 *     tags:
 *       - Tools
 *     summary: Creates a Tool.
 *     description: Creates a Tool.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: The Tool to create
 *         schema:
 *           $ref: '#/components/schemas/Tool'
 *     responses:
 *       '201':
 *         description: The Tool created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tool'
 *       '400':
 *         description: Invalid Tool
 */
router.post('/', controller.create);

/**
 * @swagger
 * /tools:
 *   put:
 *     tags:
 *       - Tools
 *     summary: Upserts a Tool in the DB at the specified ID.
 *     description: Upserts a Tool in the DB at the specified ID.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: The Tool to upsert
 *         schema:
 *           $ref: '#/components/schemas/Tool'
 *     responses:
 *       '201':
 *         description: The Tool upserted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tool'
 *       '400':
 *         description: Invalid Tool supplied
 *       '404':
 *         description: Tool not found
 */
router.put('/:id', controller.upsert);

/**
 * @swagger
 * /tools:
 *   patch:
 *     tags:
 *       - Tools
 *     summary: Updates a Tool.
 *     description: Updates a Tool.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: The Tool to update
 *         schema:
 *           $ref: '#/components/schemas/Tool'
 *     responses:
 *       '201':
 *         description: The Tool updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tool'
 *       '400':
 *         description: Invalid Tool supplied
 *       '404':
 *         description: Tool not found
 */
router.patch('/:id', controller.patch);

/**
 * @swagger
 * /tools/{id}:
 *   delete:
 *     tags:
 *       - Tools
 *     summary: Deletes a Tool by ID.
 *     description: Deletes a Tool by ID.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the Tool that needs to be deleted
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '204':
 *         description: Tool successfully removed
 *       '400':
 *         description: Invalid Tool supplied
 *       '404':
 *         description: Tool not found
 */
router.delete('/:id', controller.destroy);

module.exports = router;
