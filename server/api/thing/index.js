var express = require('express');
var controller = require('./thing.controller');

var router = express.Router();

/**
 * @swagger
 * /things:
 *   get:
 *     description: Returns things
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: things
 */
router.get('/', controller.index);
/**
 * @swagger
 * /things/{id}:
 *   get:
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: The thing ID.
 *     description: Returns the thing specified
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: thing
 */
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);

module.exports = router;
