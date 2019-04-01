var express = require('express');
var controller = require('./insight.controller');

var router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Returns a list of insights.
 *     responses:
 *       '200':
 *         description: A JSON array of insights.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/', controller.index);

/**
 * @swagger
 * /insights/{insightId}:
 *   get:
 *     summary: Returns an insight by ID.
 *     parameters:
 *       - name: insightId
 *         in: path
 *         required: true
 *         description: The insight ID
 *         schema:
 *           type: string
 *     produces:
 *      - application/json
 *     responses:
 *       '200':
 *         description: OK
 */
router.get('/:id', controller.show);

/**
 * @swagger
 * /insights:
 *   post:
 *     summary: Creates an insight.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Created
 */
router.post('/', controller.create);
router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);

module.exports = router;
