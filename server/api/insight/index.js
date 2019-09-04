var express = require('express');
var controller = require('./insight.controller');
import * as auth from '../../auth/auth.service';
import {
    accessTypes,
    userRoles
} from '../../config/environment';

const READ_ACCESS = accessTypes.ADMIN.value;
const WRITE_ACCESS = accessTypes.ADMIN.value;
const ADMIN_ACCESS = accessTypes.ADMIN.value;

var router = express.Router();

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







router.get('/:id', controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
// router.delete('/:id', controller.destroy);

// get insight by project id
router.get('/entity/:entityId', auth.canAccessEntity([
    READ_ACCESS,
    WRITE_ACCESS,
    ADMIN_ACCESS
]), controller.indexByEntity);

module.exports = router;
