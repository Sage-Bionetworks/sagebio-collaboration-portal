var express = require('express');
var controller = require('./data-catalog.controller');
var auth = require('../../auth/auth.service');
import {
    userRoles
} from '../../config/environment';

const ADMIN_ROLE = userRoles.ADMIN.value;

var router = express.Router();

/**
 * @swagger
 * /data-catalogs:
 *   get:
 *     tags:
 *       - Data catalogs
 *     summary: Returns all the Data Catalogs.
 *     description: Returns all the Data Catalogs.
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: An array of Data Catalogs
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DataCatalog'
 */
router.get('/', auth.isAuthenticated(), controller.index);

/**
 * @swagger
 * /data-catalogs/{id}:
 *   get:
 *     tags:
 *       - Data catalogs
 *     summary: Gets a Data Catalog by ID.
 *     description: Gets a Data Catalog by ID.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Data Catalog ID
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '200':
 *         description: A Data Catalog
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DataCatalog'
 *       '400':
 *         description: Invalid ID supplied
 *       '404':
 *         description: Data Catalog not found
 */
router.get('/:id', auth.isAuthenticated(), controller.show);

/**
 * @swagger
 * /data-catalogs:
 *   post:
 *     tags:
 *       - Data catalogs
 *     summary: Creates a Data Catalog.
 *     description: Creates a Data Catalog.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: The Data Catalog to create
 *         schema:
 *           $ref: '#/components/schemas/DataCatalog'
 *     responses:
 *       '201':
 *         description: The Data Catalog created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DataCatalog'
 *       '400':
 *         description: Invalid Data Catalog
 */
router.post('/', /*auth.hasPermission('createDataCatalog')*/ auth.hasRole(ADMIN_ROLE), controller.create);

/**
 * @swagger
 * /data-catalogs:
 *   put:
 *     tags:
 *       - Data catalogs
 *     summary: Upserts a Data Catalog in the DB at the specified ID.
 *     description: Upserts a Data Catalog in the DB at the specified ID.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: The Data Catalog to upsert
 *         schema:
 *           $ref: '#/components/schemas/DataCatalog'
 *     responses:
 *       '201':
 *         description: The Data Catalog upserted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DataCatalog'
 *       '400':
 *         description: Invalid Data Catalog supplied
 *       '404':
 *         description: Data Catalog not found
 */
router.put('/:id', /*auth.hasPermission('editDataCatalog')*/ auth.hasRole(ADMIN_ROLE), controller.upsert);

/**
 * @swagger
 * /data-catalogs:
 *   patch:
 *     tags:
 *       - Data catalogs
 *     summary: Updates a Data Catalog.
 *     description: Updates a Data Catalog.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: The Data Catalog to update
 *         schema:
 *           $ref: '#/components/schemas/DataCatalog'
 *     responses:
 *       '201':
 *         description: The Data Catalog updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DataCatalog'
 *       '400':
 *         description: Invalid Data Catalog supplied
 *       '404':
 *         description: Data Catalog not found
 */
router.patch('/:id', /*auth.hasPermission('editDataCatalog')*/ auth.hasRole(ADMIN_ROLE), controller.patch);

/**
 * @swagger
 * /data-catalogs/{id}:
 *   delete:
 *     tags:
 *       - Data catalogs
 *     summary: Deletes a Data Catalog by ID.
 *     description: Deletes a Data Catalog by ID.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the Data Catalog that needs to be deleted
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '204':
 *         description: Data Catalog successfully removed
 *       '400':
 *         description: Invalid Data Catalog supplied
 *       '404':
 *         description: Data Catalog not found
 */
router.delete('/:id', /*auth.hasPermission('deleteDataCatalog')*/ auth.hasRole(ADMIN_ROLE), controller.destroy);

module.exports = router;
