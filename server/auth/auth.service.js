import config from '../config/environment';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import compose from 'composable-middleware';
import User from '../api/user/user.model';
import { hasAccessToEntity, hasUserPermission, hasUserRole } from './auth';

const url = require('url');

var validateJwt = expressJwt({
    secret: config.secrets.session
});

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
export function isAuthenticated() {
    return compose()
        // Validate jwt
        .use((req, res, next) => {
            // allow access_token to be passed through query parameter as well
            if (req.query && req.query.hasOwnProperty('access_token')) {
                req.headers.authorization = `Bearer ${req.query.access_token}`;
            }
            // IE11 forgets to set Authorization header sometimes. Pull from cookie instead.
            if (req.query && typeof req.headers.authorization === 'undefined') {
                req.headers.authorization = `Bearer ${req.cookies.token}`;
            }
            validateJwt(req, res, next);
        })
        // Attach user to request
        .use((req, res, next) => {
            User.findById(req.user._id).exec()
                .then(user => {
                    if (!user) {
                        return res.status(401).end();
                    }
                    req.user = user;
                    next();
                    return null;
                })
                .catch(err => next(err));
        });
}

/**
 * Authorizes request if the user has an admin role or the requested permission.
 *
 * Users that do not contain the appropriate permission - and have not been assigned
 * an admin role - will be blocked.
 * @param {*} requestedPermission
 */
export function isAuthorized(requestedPermission) {
    return compose()
        .use((req, res, next) => {
            const userRole = req.user.role || '';
            const userId = req.user._id || '';

            let isAuthorizedForUserPermission;
            try {
                hasUserPermission(userRole, userId, requestedPermission)
                    .then(isPermitted => {
                        isAuthorizedForUserPermission = isPermitted;

                        if (isAuthorizedForUserPermission) { // Continue processing request if access is granted
                            next();
                            return null;
                        }

                        // Block request
                        res.status(403).send('Forbidden');
                        return null;
                    })
                    .catch(err => {
                        console.log(`Error attempting authorization request: ${err}`);
                        // Block request
                        res.status(403).send('Forbidden');
                        return null;
                    });
            } catch (err) {
                console.log(`Error attempting authorization request: ${err}`);
                // Block request
                res.status(403).send('Forbidden');
                return null;
            }
        });
}

/**
 * Middleware to authorize a request if the user has an admin role or the requested permission for the specified entity.
 *
 * Users that have not been assigned or accepted the requested permission for the entity will be blocked.
 * @param {*} requestedPermission
 */
export function isAuthorizedForEntity(requestedPermission) {
    return compose()
        .use((req, res, next) => {
            const userRole = req.user.role || '';
            const userId = req.user._id || '';
            const entityId = req.params.entityId || '';

            let isAuthorizedToAccessEntity;
            try {
                hasAccessToEntity(userRole, userId, requestedPermission, entityId)
                    .then(isGrantedAccess => {
                        isAuthorizedToAccessEntity = isGrantedAccess;

                        if (isAuthorizedToAccessEntity) { // Continue processing request if access is granted
                            next();
                            return null;
                        }

                        // Block request
                        res.status(403).send('Forbidden');
                        return null;
                    })
                    .catch(err => {
                        console.log(`Error attempting authorization request: ${err}`);
                        // Block request
                        res.status(403).send('Forbidden');
                        return null;
                    });
            } catch (err) {
                console.log(`Error attempting authorization request: ${err}`);
                // Block request
                res.status(403).send('Forbidden');
                return null;
            }
        });
}

/**
 * Allows request to continue if the user has authenticated and contains appropriate authorization
 * @param {string} requestedPermission (e.g. 'createTool')
 */
export function hasPermission(requestedPermission) {
    return compose()
        .use(isAuthenticated())
        .use(isAuthorized(requestedPermission));
}

/**
 * Allows request to continue if the user has authenticated and has appropriate authorization for the entity
 * @param {*} requestedPermission
 */
export function hasPermissionForEntity(requestedPermission) {
    return compose()
        .use(isAuthenticated())
        .use(isAuthorizedForEntity(requestedPermission));
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
export function hasRole(roleRequired) {
    if (!roleRequired) {
        throw new Error('Required role needs to be set');
    }

    return compose()
        .use(isAuthenticated())
        .use(function meetsRequirements(req, res, next) {
            const userRole = req.user.role || '';
            if (hasUserRole(userRole, roleRequired)) {
                // Continue processing request when user has role
                return next();
            }
            return res.status(403).send('Forbidden');
        });
}

/**
 * Returns a jwt token signed by the app secret
 */
export function signToken(id, role) {
    return jwt.sign({
        _id: id,
        role
    }, config.secrets.session, {
        expiresIn: config.expiresIn.session
    });
}

/**
 * Set token cookie directly for oAuth strategies
 */
export function setTokenCookie(req, res) {
    if (!req.user) {
        return res.status(404).send('It looks like you aren\'t logged in, please try again.');
    }
    var token = signToken(req.user._id, req.user.role);
    res.redirect(url.format({
        pathname: '/login',
        query: {
            token,
            expiresIn: config.expiresIn.session
        }
    }));
}
