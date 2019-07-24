import User from '../api/user/user.model';
import UserPermission from '../api/user-permission/user-permission.model';
import EntityPermission from '../api/entity-permission/entity-permission.model';
import config from '../config/environment';

export class AuthorizationSignal {
    constructor(isAuthorized) {
        this.isAuthorized = isAuthorized;
    }

    isAuthorized() {
        return this.isAuthorized;
    }
}

/**
 * Returns true if the user has the requested role.
 *
 * @param {string} userId
 * @param {string} role
 * @return {Promise<boolean>}
 */
export function hasRole(userId, role) {
    return new Promise((resolve) => {
        User.findById(userId)
            .exec()
            .then(user => {
                if (user) {
                    const roles = Object.values(config.userRolesNew).map(role => role.value);
                    throw new AuthorizationSignal(
                        roles.indexOf(user.role) === roles.indexOf(role)
                    );
                }
                throw new AuthorizationSignal(false);
            });
    });
}

/**
 * Returns true if the user is an admin.
 *
 * @param {string} userId
 * @return {Promise<boolean>}
 */
export function isAdmin(userId) {
    return hasRole(userId, config.userRolesNew.ADMIN.value);
}

/**
 * Returns true if the user has access to the specified entity.
 *
 * @param {string} userId
 * @param {string} allowedAccesses
 * @param {string} entityId
 * @return {Promise<boolean>}
 */
export function hasAccessToEntity(userId, allowedAccesses, entityId) {
    return new Promise((resolve, reject) => isAdmin(userId)
        .then(handleIsAdmin())
        .then(unauthorizeIfTrue(!allowedAccesses))
        .then(() => EntityPermission.find({
            entityId,
            user: userId,
            access: { '$in': allowedAccesses },
            status: config.inviteStatusTypes.ACCEPTED.value
        }).exec())
        .then(handlePermissionNotFound())
        .then(() => {
            throw new AuthorizationSignal(true);
        })
        // .catch(AuthorizationSignal, signal => {
        //     return resolve(signal.isAuthorized())
        // })
        // .catch(handleError(reject))
    );
}

/**
 * Returns true if the user has the permission specified.
 *
 * @param {string} userId
 * @param {string} permission
 * @return {Promise<boolean>}
 */
export function hasUserPermission(userId, permission) {
    return new Promise((resolve, reject) => isAdmin(userId)
        .then(handleIsAdmin())
        .then(unauthorizeIfTrue(!permission))
        .then(() => UserPermission.find({
            user: userId,
            permission: permission
        }).exec())
        .then(handlePermissionNotFound())
        .then(() => {
            throw new AuthorizationSignal(true);
        })
        // .catch(AuthorizationSignal, signal => {
        //     return resolve(signal.isAuthorized())
        // })
        // .catch(handleError(reject))
    );
}

// HELPER FUNCTIONS

function handleIsAdmin() {
    return function (isAdmin) {
        if (isAdmin) {
            throw new AuthorizationSignal(true);
        }
        return isAdmin;
    }
}

function unauthorizeIfTrue(condition) {
    return function () {
        throw new AuthorizationSignal(false);
    }
}

function handlePermissionNotFound() {
    return function (permissions) {
        if (!permissions) {
            throw new AuthorizationSignal(false);
        }
        return permissions;
    }
}

function handleError(reject) {
    return function (err) {
        console.log(err);
        return reject(false);
    }
}
