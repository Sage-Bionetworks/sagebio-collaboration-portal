var express = require('express');
var controller = require('./resource.controller');
import * as auth from '../../auth/auth.service';
import * as resourceAuth from './resource.auth';

var router = express.Router();

/**
 * @swagger
 * /resources:
 *   get:
 *     tags:
 *       - Resources
 *     summary: Returns the Resources visible to the user.
 *     description: Returns the Resources visible to the user.
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: An array of Resources
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Resource'
 */
router.get('/', auth.isAuthenticated(), controller.index);

/**
 * @swagger
 * /resources/{id}:
 *   get:
 *     tags:
 *       - Resources
 *     summary: Gets a Resource by ID.
 *     description: Gets a Resource by ID.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Resource ID
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '200':
 *         description: A Resource
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Resource'
 *       '400':
 *         description: Invalid ID supplied
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Resource not found
 */
router.get('/:id', resourceAuth.canReadResource(), controller.show);

/**
 * @swagger
 * /resources:
 *   post:
 *     tags:
 *       - Resources
 *     summary: Creates a Resource.
 *     description: Creates a Resource.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: The Resource to create
 *         schema:
 *           $ref: '#/components/schemas/Resource'
 *     responses:
 *       '201':
 *         description: The Resource created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Resource'
 *       '400':
 *         description: Invalid Resource
 */
router.post('/', resourceAuth.canCreateResource(), controller.create);




router.patch('/:id', resourceAuth.canEditResource(), controller.patch);




// router.get('/entity/:entityId',
// // auth.canAccessEntity([
// //     READ_ACCESS,
// //     WRITE_ACCESS,
// //     ADMIN_ACCESS
// // ]),
// controller.indexByEntity);

// router.delete('/:id', controller.destroy);

module.exports = router;
