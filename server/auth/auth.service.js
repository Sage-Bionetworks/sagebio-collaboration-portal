import config from '../config/environment';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import compose from 'composable-middleware';
import User from '../api/user/user.model';
import UserPermission from '../api/user-permission/user-permission.model';
import EntityPermission from '../api/entity-permission/entity-permission.model';

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
            const isAdminRole = config.userRoles.indexOf(req.user.role) == config.userRoles.indexOf('admin');

            // Automatically grant admin users permission
            if (isAdminRole) return next();

            // Block non-admin users if the required permission is falsy
            if (!requestedPermission) {
                res.status(403).send('Forbidden');
                return null;
            }

            // Check if our user has the appropriate permission
            UserPermission.find({
                    user: req.user._id
                }).exec()
                .then(permissions => {
                    const hasAuthorization = !!permissions.find(p => p.permission === requestedPermission);

                    // Continuing processing request if our user has the appropriate permission
                    if (hasAuthorization) return next();

                    // User does not have permission; block request
                    res.status(403).send('Forbidden');
                    return null;
                })
                .catch(err => res.status(500).send(`Sorry - there was an error processing your request: ${err}`));
        });
}

/**
 * Authorizes request if the user has an admin role or the requested permission for the specified entity.
 *
 * Users that have not been assigned or accepted the requested permission for the entity will be blocked.
 * @param {*} requestedPermission
 */
export function isAuthorizedForEntity(requestedPermission) {
    return compose()
        // WIP #252 - Refactor method
        .use((req, res, next) => {
            const isAdminRole = config.userRoles.indexOf(req.user.role) === config.userRoles.indexOf('admin');

            // Automatically grant admin users permission
            if (isAdminRole) {
                return next();
            }

            // Block non-admin users if the required permission is falsy
            if (!requestedPermission) {
                res.status(403).send('Forbidden');
                return null;
            }

            const entityId = req.params.entityId;

            // Check if our user has the appropriate permission
            EntityPermission.find({
                    user: req.user._id,
                    entityId: entityId
                }).exec()
                .then(entityPermissions => {
                    const userEntityPermission = entityPermissions.find(ep => ep.access === requestedPermission);

                    // Continue processing if our user has been granted permission to the entity AND it has been accepted/confirmed
                    if (userEntityPermission && userEntityPermission.status === config.inviteStatusTypes.ACCEPTED.value) {
                        next();
                        return null;
                    }

                    // User does not have permission OR has not accepted the entity permission; block request
                    res.status(403).send('Forbidden');
                    return null;
                })
                .catch(err => {
                    res.status(500).send(`There was an error processing your request: ${err}`);
                    return null;
                });
        });
}

export function hasAccessToEntity(userRole, userId, requestedPermission, entityId) {
    // WIP #252 - Add safeguards to protect against improper/missing parameters
    const isAdminRole = userRole === config.userRoles.indexOf('admin');

    // Automatically grant admin users permission
    if (isAdminRole) {
        return true;
    }

    // Block non-admin users if the required permission is falsy
    if (!requestedPermission) {
        return false;
    }

    // Check if our user has the appropriate permission
    EntityPermission.find({
        user: userId,
        entityId
    }).exec()
        .then(entityPermissions => {
            const userEntityPermission = entityPermissions.find(ep => ep.access === requestedPermission);

            // Continue processing if our user has been granted permission to the entity AND it has been accepted/confirmed
            if (userEntityPermission && userEntityPermission.status === config.inviteStatusTypes.ACCEPTED.value) {
                return true;
            }

            // User does not have permission OR has not accepted the entity permission; block request
            return false;
        })
        .catch(err => {
            const errorMessage = `There was an error processing your request: ${err}`;
            console.error(errorMessage);
            // WIP #252 - Actually...maybe this should throw an error instead...
            return false;
        });
}

/**
 * Allows request to continue if the user has authenticated and contains appropriate authorization
 * @param {*} requestedPermission
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
            if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
                return next();
            } else {
                return res.status(403).send('Forbidden');
            }
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
        pathname: "/login",
        query: {
            token,
            expiresIn: config.expiresIn.session
        }
    }));
}
