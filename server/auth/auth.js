import config from '../config/environment';
import UserPermission from '../api/user-permission/user-permission.model';
import EntityPermission from '../api/entity-permission/entity-permission.model';

/**
 * Returns true only if the user has an admin role
 *
 * @param {string} userRole
 */
export function isAdminRole(userRole) {
    return config.userRoles.indexOf(userRole) == config.userRoles.indexOf('admin');
}

/**
 * This function can be used to determine whether or not a user has access to an entity (such as when used by our web sockets)
 *
 * Returns false unless a user has an admin role or accepted the requested permission for the specified entity.
 *
 * @param {string} userRole
 * @param {string} userId
 * @param {string} requestedPermission
 * @param {string} entityId
 */
export function hasAccessToEntity(userRole, userId, requestedPermission, entityId) {
    return new Promise((resolve, reject) => {
        const IS_ADMIN_ROLE = isAdminRole(userRole);

        // Automatically grant admin users permission
        if (IS_ADMIN_ROLE) {
            return resolve(true);
        }

        // Block non-admin users if the required permission is falsy
        if (!requestedPermission) {
            return resolve(false);
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
                    return resolve(true);
                }

                // User does not have permission OR has not accepted the entity permission; block request
                return resolve(false);
            })
            .catch(err => {
                const errorMessage = `There was an error processing your request: ${err}`;
                console.error(errorMessage);
                return reject(false);
            });
    });
}

/**
 * Returns true if the user has the desired permission
 *
 * @param {string} userRole
 * @param {string} userId
 * @param {string} requestedPermission
 */
export function hasUserPermission(userRole, userId, requestedPermission) {
    return new Promise((resolve, reject) => {
        const IS_ADMIN_ROLE = isAdminRole(userRole);

        // Automatically grant admin users permission
        if (IS_ADMIN_ROLE) return resolve(true);

        // Block non-admin users if the required permission is falsy
        if (!requestedPermission) {
            return resolve(false);
        }

        // Check if our user has the appropriate permission
        UserPermission.find({
            user: userId,
        }).exec()
            .then(permissions => {
                const hasAuthorization = !!permissions.find(p => p.permission === requestedPermission);

                // Continuing processing request if our user has the appropriate permission
                if (hasAuthorization) return resolve(true);

                // User does not have permission; block request
                return resolve(false);
            })
            .catch(err => {
                const errorMessage = `There was an error processing your request: ${err}`;
                console.error(errorMessage);
                return reject(false);
            });
    });
}

/**
 * Resolves as true if the userRole matches the requestedRole
 *
 * @param {string} userRole
 * @param {string} requestedRole
 */
export function hasUserRole(userRole, requestedRole) {
    return new Promise((resolve) => {
        if (config.userRoles.indexOf(userRole) === config.userRoles.indexOf(requestedRole)) {
            return resolve(true);
        } else {
            return resolve(false);
        }
    });
}
