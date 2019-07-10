import express from 'express';
import config from '../config/environment';
import User from '../api/user/user.model';
import Organization from '../api/organization/organization.model';

var router = express.Router();

for (var strategy of config.authStrategies) {
    require(`./${strategy}/passport`).setup(User, Organization, config);  // Passport Configuration
    router.use(`/${strategy}`, require(`./${strategy}`).default);
}

/**
 * @swagger
 * /auth/strategies:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Returns the list of authentication strategies available.
 *     description: Returns the list of authentication strategies available.
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: An array of authentication strategies
 *         schema:
 *           type: array
 *           items:
 *             string
 */
router.get('/strategies', (req, res, next) => {
    res.status(200).json(config.authStrategies);
})

export default router;
