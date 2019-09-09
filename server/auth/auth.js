import User from '../api/user/user.model';
import UserPermission from '../api/action-permission/action-permission.model';
import EntityPermission from '../api/entity-permission/entity-permission.model';
import config from '../config/environment';
import AuthError from './auth-error';

// This file implements authentication and authorization functions that can be used
// to protect API endpoints and websocket communications.

/**
 * Resolves as true if the user has the role specified.
 * @param {string} userId
 * @param {string} role
 * @return {Promise<boolean>}
 */
export function hasRole(userId, role) {
    return new Promise(resolve => {
        User.findById(userId)
            .exec()
            .then(user => {
                if (user) {
                    // throw new Error('plop');
                    const roles = Object.values(config.userRoles).map(r => r.value);
                    const userHasRole = roles.indexOf(user.role) === roles.indexOf(role);
                    return resolve(userHasRole);
                }
                return resolve(false);
            })
            .catch(err => {
                throw new AuthError(`Unable to check user role: ${err.message}`);
            });
    });
}

/**
 * Resolves as true if the user has the portal role Admin.
 * @param {string} userId
 * @return {Promise<boolean>}
 */
export function isAdmin(userId) {
    return hasRole(userId, config.userRoles.ADMIN.value);
}

/**
 * Resolves as true if the user has the portal role Admin OR if the user has created the object.
 * @param {*} userId
 * @param {*} createdByUserId
 */
export function isOwner(userId, createdByUserId) {
    return new Promise(resolve => {
        const _isAdmin = async () => await isAdmin(userId);
        if (_isAdmin) {
            return resolve(true);
        }
        return resolve(userId === createdByUserId);
    });
}

/**
 * Resolves as true if the user has the permission specified.
 * TODO: Rename `user-permission` into `action-permission`
 * @param {string} userId
 * @param {string} permission
 * @return {Promise<boolean>}
 */
export function hasUserPermission(userId, permission) {
    return new Promise(resolve => {
        if (!permission) {
            return resolve(false);
        }

        return isAdmin(userId)
            .then(isAuthorized => {
                if (!isAuthorized) {
                    const filter = {
                        user: userId,
                        permission,
                    };
                    return UserPermission.find(filter)
                        .exec()
                        .then(userPermission => !!userPermission);
                }
                return isAuthorized;
            })
            .then(isAuthorized => resolve(isAuthorized))
            .catch(err => {
                throw new Error(err);
            });
    });
}

/**
 * Resolves as true if the entity is public or if the user has one of the entity-permission specified.
 * @param {*} userId
 * @param {*} entityId
 * @param {*} entityType
 * @param {*} entityVisibility
 * @param {*} allowedAccesses
 * @param {*} allowedAccessStatus
 */
export function canReadEntity(
    userId,
    entityId,
    entityType,
    entityVisibility,
    allowedAccesses,
    allowedAccessStatus
) {
    return new Promise(resolve => {
        if (entityVisibility) {
            return resolve(true);
        }

        return hasEntityPermission(userId, entityId, entityType, allowedAccesses, allowedAccessStatus);
    });
}

/**
 * Resolves as true if the user has one of the entity-permission specified.
 * @param {*} userId
 * @param {*} entityId
 * @param {*} entityType
 * @param {*} allowedAccesses
 * @param {*} allowedAccessStatus
 */
export function hasEntityPermission(
    userId,
    entityId,
    entityType,
    allowedAccesses,
    allowedAccessStatus
) {
    return new Promise(resolve => {
        if (!allowedAccesses) {
            return resolve(false);
        }

        return isAdmin(userId)
            .then(isAuthorized => {
                if (!isAuthorized) {
                    const filter = {
                        entityId,
                        entityType,
                        user: userId,
                        access: {
                            $in: allowedAccesses,
                        },
                        status: {
                            $in: allowedAccessStatus,
                        },
                    };
                    return EntityPermission.find(filter, '_id')
                        .exec()
                        .then(permission => !!permission);
                }
                return isAuthorized;
            })
            .then(isAuthorized => resolve(isAuthorized))
            .catch(err => {
                throw new Error(err);
            });
    });
}

/**
 * Resolves as true if the user has one of the entity-permission specified
 * AND is the entity owner id.
 * @param {R} userId
 * @param {*} entityId
 * @param {*} entityType
 * @param {*} entityOwnerId
 * @param {*} allowedAccesses
 * @param {*} allowedAccessStatus
 */
export function isEntityOwner(
    userId,
    entityId,
    entityType,
    entityOwnerId,
    allowedAccesses,
    allowedAccessStatus
) {
    return hasEntityPermission(
        userId,
        entityId,
        entityType,
        entityOwnerId,
        allowedAccesses,
        allowedAccessStatus
    )
        .then(isAuthorized => isAuthorized && userId.toString() === entityOwnerId.toString());
}
