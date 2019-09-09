import { Router } from 'express';
import * as controller from './app.controller';

var router = Router();

/**
 * @swagger
 * /apps:
 *   get:
 *     tags:
 *       - Apps
 *     summary: Gets the App.
 *     description: Gets the App.
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: An App
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/App'
 *       '404':
 *         description: App not found
 */
router.get('/', controller.show);

module.exports = router;
