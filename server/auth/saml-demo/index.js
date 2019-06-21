import express from 'express';
// import passport from 'passport';
// import {
//     setTokenCookie
// } from '../auth.service';
// const url = require('url');

var router = express.Router();

/**
 * @swagger
 * /auth/saml-demo:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Authenticates a User via Google SAML.
 *     description: Authenticates a User via Google SAML.
 */
router.get('/',
    (_, res) => {
        res.send('[DEMO] SAML authentication using a custom Google App');
    }
    // passport.authenticate('google', {
    //     failureRedirect: '/login',
    //     scope: [
    //         'profile',
    //         'email'
    //     ],
    //     session: false
    // })
);

/**
 * @swagger
 * /auth/saml-demo/callback:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Redirects the user to the portal.
 *     description: Redirects the user to the portal.
 *     responses:
 *       '404':
 *         description: User not found
 */
// router.get('/callback', (req, res, next) => {
//     // passport.authenticate('google', {
//     //     // failureRedirect: '/login',
//     //     // failureFlash: true,
//     //     session: false
//     // }, (err, user, info) => {
//     //     if (err) {
//     //         return next(err);
//     //     }
//     //     if (!user) {
//     //         res.redirect(url.format({
//     //             pathname: '/login',
//     //             query: {
//     //                 message: info
//     //             }
//     //         }));
//     //     } else {
//     //         req.user = user;
//     //         next();
//     //         return null;
//     //     }
//     // })(req, res, next);
// }, setTokenCookie);

export default router;
