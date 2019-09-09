import { Router } from 'express';
import * as auth from '../../auth/auth.service';
import * as dataCatalogAuth from './data-catalog.auth';
import * as controller from './data-catalog.controller';

var router = Router();

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
router.get('/:id', dataCatalogAuth.canReadDataCatalog(), controller.show);

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
router.post('/', dataCatalogAuth.canCreateDataCatalog(), controller.create);

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
router.patch('/:id', dataCatalogAuth.canEditDataCatalog(), controller.patch);

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
router.delete('/:id', dataCatalogAuth.canDeleteDataCatalog(), controller.destroy);

module.exports = router;
