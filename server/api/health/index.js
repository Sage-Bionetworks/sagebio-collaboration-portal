import { Router } from 'express';
import * as controller from './health.controller';

var router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     tags:
 *       - App health
 *     summary: Gets a AppHealth object.
 *     description: Gets a AppHealth object.
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: A AppHealth object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppHealth'
 */
router.get('/', controller.show);

module.exports = router;
