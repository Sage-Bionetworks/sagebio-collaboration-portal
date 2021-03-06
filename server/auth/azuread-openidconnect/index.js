import express from 'express';
import passport from 'passport';
import {
    setTokenCookie
} from '../auth.service';
const url = require('url');

var router = express.Router();

/**
 * @swagger
 * /auth/azuread-openidconnect:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Authenticates a User via Azure AD.
 *     description: Authenticates a User via Azure AD.
 */
router.get('/', (req, res, next) => {
    passport.authenticate('azuread-openidconnect', {
        response: res,
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

/**
 * @swagger
 * /auth/azuread-openidconnect/callback:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Redirects the user to the portal.
 *     description: Redirects the user to the portal.
 *     responses:
 *       '404':
 *         description: User not found
 */
router.post('/callback', (req, res, next) => {
    passport.authenticate('azuread-openidconnect', {
        response: res,
        session: false
    }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            res.redirect(url.format({
                pathname: '/login',
                query: {
                    message: info
                }
            }));
        } else {
            req.user = user;
            next();
            return null;
        }
    })(req, res, next);
}, setTokenCookie);

export default router;
