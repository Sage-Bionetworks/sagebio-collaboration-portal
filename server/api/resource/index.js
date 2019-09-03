var express = require('express');
var controller = require('./resource.controller');
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


router.get('/:id', controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', controller.upsert);

router.patch('/:id', controller.patch);

router.get('/entity/:entityId', auth.hasPermissionForEntity([
    READ_ACCESS,
    WRITE_ACCESS,
    ADMIN_ACCESS
]), controller.indexByEntity);

// router.delete('/:id', controller.destroy);

module.exports = router;
