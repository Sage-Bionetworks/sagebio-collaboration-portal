import express from 'express';
import passport from 'passport';
import {
    signToken
} from '../auth.service';

var router = express.Router();

/**
 * @swagger
 * /auth/local:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Authenticates a User.
 *     description: Authenticates a User.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: The user's email and password
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *             password:
 *               type: string
 *               format: password
 *     responses:
 *       '201':
 *         description: The Token Response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenResponse'
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: User not found
 */
router.post('/', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        var error = err || info;
        if (error) {
            return res.status(401).json(error);
        }
        if (!user) {
            return res.status(404).json({
                message: 'Something went wrong, please try again.'
            });
        }

        var token = signToken(user._id, user.role);
        res.json({
            token
        });
    })(req, res, next);
});

export default router;
