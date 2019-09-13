import { Router } from 'express';
import * as auth from '../../auth/auth.service';
import * as insightAuth from './insight.auth';
import * as controller from './insight.controller';

var router = Router();

/**
 * @swagger
 * /insights:
 *   get:
 *     tags:
 *       - Insights
 *     summary: Returns the Insights visible to the user.
 *     description: Returns the Insights visible to the user.
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: An array of Insights
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Insight'
 */
router.get('/', auth.isAuthenticated(), controller.index);

/**
 * @swagger
 * /insights/{id}:
 *   get:
 *     tags:
 *       - Insights
 *     summary: Gets an Insight by ID.
 *     description: Gets an Insight by ID.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Insight ID
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '200':
 *         description: A Insight
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Insight'
 *       '400':
 *         description: Invalid ID supplied
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Insight not found
 */
router.get('/:id', insightAuth.canReadInsight(), controller.show);

/**
 * @swagger
 * /insights:
 *   post:
 *     tags:
 *       - Insights
 *     summary: Creates an Insight.
 *     description: Creates an Insight.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: The Insight to create
 *         schema:
 *           $ref: '#/components/schemas/Insight'
 *     responses:
 *       '201':
 *         description: The Insight created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Insight'
 *       '400':
 *         description: Invalid Insight
 */
router.post('/', insightAuth.canCreateInsight(), controller.create);

/**
 * @swagger
 * /insights/{id}:
 *   patch:
 *     tags:
 *       - Insights
 *     summary: Updates an Insight.
 *     description: Updates an Insight.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: The Insight to update
 *         schema:
 *           $ref: '#/components/schemas/Insight'
 *     responses:
 *       '201':
 *         description: The Insight updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Insight'
 *       '400':
 *         description: Invalid Insight supplied
 *       '404':
 *         description: Insight not found
 */
router.patch('/:id', insightAuth.canEditInsight(), controller.patch);

/**
 * @swagger
 * /insights/{id}:
 *   delete:
 *     tags:
 *       - Insights
 *     summary: Deletes an Insight by ID.
 *     description: Deletes an Insight by ID.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the Insight that needs to be deleted
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '204':
 *         description: Insight successfully removed
 *       '400':
 *         description: Invalid Insight supplied
 *       '404':
 *         description: Insight not found
 */
router.delete('/:id', insightAuth.canDeleteInsight(), controller.destroy);

router.post('/:id/attachments', auth.isAuthenticated(), controller.createAttachments);

module.exports = router;
