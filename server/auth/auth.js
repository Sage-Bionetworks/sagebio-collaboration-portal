import User from '../api/user/user.model';
import UserPermission from '../api/user-permission/user-permission.model';
import EntityPermission from '../api/entity-permission/entity-permission.model';
import config from '../config/environment';

/**
 * Resolves as true if the user has the requested role.
 *
 * @param {string} userId
 * @param {string} role
 * @return {Promise<boolean>}
 */
export function hasRole(userId, role) {
    return new Promise((resolve) => {
        const user = async () => await User.findById(userId).exec();

        if (user) {
            // Determine if the user has the appropriate role
            const roles = Object.values(config.userRolesNew).map(r => r.value);
            const userHasRole = roles.indexOf(user.role) === roles.indexOf(role);

            // Authorize if the user has the requested role; otherwise deny access
            return resolve(userHasRole);
        }

        // DEFAULT: Deny access
        return resolve(false);
    });
}

/**
 * Resolves as true if the user is an admin.
 *
 * @param {string} userId
 * @return {Promise<boolean>}
 */
export function isAdmin(userId) {
    return hasRole(userId, config.userRolesNew.ADMIN.value);
}

/**
 * Resolves as true if the user has access to the specified entity.
 *
 * @param {string} userId
 * @param {string} allowedAccesses
 * @param {string} entityId
 * @return {Promise<boolean>}
 */
export function hasAccessToEntity(userId, allowedAccesses, entityId) {
    return new Promise((resolve) => {
        // If the user has an admin role; grant access and exit
        const _isAdmin = async () => await isAdmin(userId);
        if (_isAdmin) return resolve(true);

        // Deny access if a falsy value is provided and exit
        if (!allowedAccesses) return resolve(false);

        // Determine if the user has the appropriate entity permission
        const filter = {
            entityId,
            user: userId,
            access: { $in: allowedAccesses },
            status: config.inviteStatusTypes.ACCEPTED.value
        };
        const entityPermission = async () => await EntityPermission.find(filter).exec()
            .catch(err => {
                throw new Error(err);
            });

        // If we have a match; grant access and exit
        if (entityPermission) return resolve(true);

        // DEFAULT: Deny access
        return resolve(false);
    });
}

/**
 * Resolves as true if the user has the permission specified.
 *
 * @param {string} userId
 * @param {string} permission
 * @return {Promise<boolean>}
 */
export function hasUserPermission(userId, permission) {
    return new Promise((resolve) => {
        // If the user has an admin role; grant access and exit
        const _isAdmin = async () => await isAdmin(userId);
        if (_isAdmin) return resolve(true); // User has an admin role; grant access and exit processing

        // Deny access if a falsy value is provided and exit
        if (!permission) return resolve(false); // Falsy value; deny access and exit processing

        // Determine if the user has the appropriate permission
        const filter = {
            user: userId,
            permission,
        };
        const userPermission = async () => await UserPermission.find(filter).exec();

        // If we have a match; grant access and exit
        if (userPermission) return resolve(true);

        // DEFAULT: Deny access
        return resolve(false);
    });
}
