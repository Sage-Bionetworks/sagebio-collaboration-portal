import config from '../config/environment';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import compose from 'composable-middleware';
import User from '../api/user/user.model';
import { hasRole as hasRole_, hasUserPermission as hasUserPermission_, canReadEntity as canReadEntity_ } from './auth';
const url = require('url');

var validateJwt = expressJwt({
    secret: config.secrets.session,
});

/**
 * Attaches the user object to the request if authenticated.
 * Otherwise returns 401.
 */
export function isAuthenticated() {
    return (
        compose()
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
                User.findById(req.user._id)
                    .exec()
                    .then(user => {
                        if (!user) {
                            return res.status(401).end();
                        }
                        req.user = user;
                        next();
                        return null;
                    })
                    .catch(err => next(err));
            })
    );
}

/**
 * Resolves as true if the user has the role specified.
 * Otherwise returns 403.
 * @param {*} role
 */
export function hasRole(role) {
    return compose()
        .use(isAuthenticated())
        .use(function meetsRequirements(req, res, next) {
            if (hasRole_(req.user._id, role)) {
                return next();
            }
            return res.status(403).send('Forbidden');
        });
}

/**
 * Resolves as true if the user has the permission specified.
 * TODO: Rename `user-permission` into `action-permission`
 * @param {*} permission
 */
export function hasUserPermission(permission) {
    return compose()
        .use(isAuthenticated())
        .use((req, res, next) =>
            hasUserPermission_(req.user._id, permission)
                .then(accessGranted => {
                    if (accessGranted) return next();
                    return null;
                })
                .catch(() => {
                    res.status(403).send('Forbidden');
                    return null;
                })
        );
}

/**
 * Resolves as true if the entity is public or if the user has one of the entity-permission specified.
 * @param {*} attachEntityAuthorizationDetails
 */
export function canReadEntity(
    attachEntityAuthorizationDetails_,
    allowedAccesses = [],
    allowedAccessStatus = [config.inviteStatusTypes.ACCEPTED.value]
) {
    return compose()
        .use(isAuthenticated())
        .use(attachEntityAuthorizationDetails_)
        .use((req, res, next) =>
            canReadEntity_(
                req.user._id,
                req.entity._id,
                req.entity.entityType,
                req.entity.visibility,
                allowedAccesses,
                allowedAccessStatus
            )
                .then(accessGranted => {
                    if (accessGranted) return next();
                    return null;
                })
                .catch(() => {
                    res.status(403).send('Forbidden');
                    return null;
                })
        );
}

/**
 * Resolves as true if the user has one of the entity-permission specified.
 * @param {*} attachEntityAuthorizationDetails_
 * @param {*} allowedAccesses
 * @param {*} allowedAccessStatus
 */
export function hasEntityPermission(
    attachEntityAuthorizationDetails_,
    allowedAccesses = [],
    allowedAccessStatus = [config.inviteStatusTypes.ACCEPTED.value]
) {
    return compose()
        .use(isAuthenticated())
        .use(attachEntityAuthorizationDetails_)
        .use((req, res, next) =>
            canReadEntity_(req.user._id, req.entity._id, req.entity.entityType, allowedAccesses, allowedAccessStatus)
                .then(accessGranted => {
                    if (accessGranted) return next();
                    return null;
                })
                .catch(() => {
                    res.status(403).send('Forbidden');
                    return null;
                })
        );
}

// HELPER FUNCTIONS

/**
 * Attaches the information required for authorization to the request object.
 *
 * This method must be used when verifying the authorization against the entity
 * specified by req.params.id (e.g. Project). If the authorization must be performed
 * against another object (e.g. the project a Resource is assigned to), then another
 * method must be implemented to attach the details of the other object to req.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export function attachEntityAuthorizationDetails(Model, entityType) {
    return compose().use((req, res, next) => {
        Model.findById(req.params.id, '_id visibility')
            .exec()
            .then(entity => {
                if (!entity) {
                    return res.status(403).end();
                }
                req.entity = {
                    _id: entity._id,
                    entityType,
                    visibility: entity.visibility,
                };
                next();
                return null;
            })
            .catch(err => next(err));
    });
}

/**
 * Returns a jwt token signed by the app secret.
 * @param {*} id
 * @param {*} role
 */
export function signToken(id, role) {
    return jwt.sign(
        {
            _id: id,
            role,
        },
        config.secrets.session,
        {
            expiresIn: config.expiresIn.session,
        }
    );
}

/**
 * Set token cookie directly for oAuth strategies.
 * @param {*} req
 * @param {*} res
 */
export function setTokenCookie(req, res) {
    if (!req.user) {
        return res.status(404).send('It looks like you aren\'t logged in, please try again.');
    }
    var token = signToken(req.user._id, req.user.role);
    res.redirect(
        url.format({
            pathname: '/login',
            query: {
                token,
                expiresIn: config.expiresIn.session,
            },
        })
    );
}

// /**
//  * Resolves as true if the user has read access to the entity based on the
//  * details provided in req.entity.
//  * @param {*} allowedAccesses
//  */
// export function canReadEntity() {
//     return compose().use((req, res, next) =>
//         canReadEntity_(req.user._id, req.entity._id, req.entity.entityType, req.entity.visibility)
//             .then(accessGranted => {
//                 if (accessGranted) return next();
//                 return null;
//             })
//             .catch(() => {
//                 res.status(403).send('Forbidden');
//                 return null;
//             })
//     );
// }

// export function canWriteEntity() {
//     return compose().use((req, res, next) =>
//         canWriteEntity_(req.user._id, req.entity._id, req.entity.entityType)
//             .then(accessGranted => {
//                 if (accessGranted) return next();
//                 return null;
//             })
//             .catch(() => {
//                 res.status(403).send('Forbidden');
//                 return null;
//             })
//     );
// }

// export function canAdminEntity() {
//     return compose().use((req, res, next) =>
//         canAdminEntity_(req.user._id, req.entity._id, req.entity.entityType)
//             .then(accessGranted => {
//                 if (accessGranted) return next();
//                 return null;
//             })
//             .catch(() => {
//                 res.status(403).send('Forbidden');
//                 return null;
//             })
//     );
// }

// /**
//  * Middleware to authorize a request if the user has an admin role or the requested permission for the specified entity.
//  *
//  * Users that have not been assigned or accepted the requested permission for the entity will be blocked.
//  * @param {*} allowedAccesses
//  */
// export function isAuthorizedForEntity(allowedAccesses) {
//     return compose().use((req, res, next) =>
//         _hasAccessToEntity(req.user._id, allowedAccesses, /*req.params.entityId*/ req.entity._id)
//             .then(accessGranted => {
//                 if (accessGranted) return next();
//                 return null;
//             })
//             .catch(err => {
//                 console.error(`ERROR attempting authorization request for entity: ${err}`);
//                 res.status(403).send('Forbidden');
//                 return null;
//             })
//     );
// }

// export function isAuthorizedForEntityRelatedObject(Model) {
//     return compose().use((req, res, next) =>
//         _hasAccessToEntityRelatedObject(req.user._id, req.params.entityId, req.params.id, Model)
//             .then(accessGranted => {
//                 if (accessGranted) return next();
//                 return null;
//             })
//             .catch(err => {
//                 console.error(`ERROR attempting authorization request for entity-related object: ${err}`);
//                 res.status(403).send('Forbidden');
//                 return null;
//             })
//     );
// }

// /**
//  * Allows request to continue if the user has authenticated and contains appropriate authorization
//  * @param {string} permission (e.g. 'createTool')
//  */
// export function hasPermission(permission) {
//     return compose()
//         .use(isAuthenticated())
//         .use(isAuthorized(permission));
// }

// /**
//  * Allows request to continue if the user has authenticated and has appropriate authorization for the entity
//  * @param {*} allowedAccesses
//  */
// export function canAccessEntity(attachesEntityAuthorizationDetails_, allowedAccesses) {
//     return compose().use(isAuthenticated());
//     // .use(attachesEntityAuthorizationDetails_())
//     // .use(isAuthorizedForEntity(allowedAccesses));
// }

// // export function canReadEntity(attachesEntityAuthorizationDetails_, allowedAccesses) {
// //     return compose()
// //         .use(isAuthenticated())
// //         .use(attachesEntityAuthorizationDetails_)
// //         .use(hasReadAccessToEntity(allowedAccesses));
// // }

// // export function canAccessResource(allowedAccesses) {
// //     return compose()
// //         .use(isAuthenticated())
// //         .use()
// // }

// export function hasPermissionForEntityRelatedObject(Model) {
//     return compose()
//         .use(isAuthenticated())
//         .use(isAuthorizedForEntityRelatedObject(Model));
// }
