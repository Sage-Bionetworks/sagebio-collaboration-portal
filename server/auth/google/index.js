import express from 'express';
import passport from 'passport';
import {
    setTokenCookie
} from '../auth.service';
const url = require('url');

var router = express.Router();

router
    .get('/',
        passport.authenticate('google', {
            failureRedirect: '/login',
            scope: [
                'profile',
                'email'
            ],
            session: false
        }))
    .get('/callback', (req, res, next) => {
        passport.authenticate('google', {
            // failureRedirect: '/login',
            // failureFlash: true,
            session: false
        }, (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                res.redirect(url.format({
                    pathname: "/login",
                    query: {
                        message: info
                    }
                }));
            } else {
                req.user = user;
                next();
                return null;
            }
        })(req, res, next)
    }, setTokenCookie);

export default router;
