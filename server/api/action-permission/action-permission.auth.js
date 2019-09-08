import * as auth from '../../auth/auth.service';
import { userRoles } from '../../config/environment';

/**
 * Resolves as true if the user can query the action-permissions of any users.
 *
 * Resolves as true if the user has the role Admin.
 */
export function canReadActionPermission() {
    return auth.hasRole(userRoles.ADMIN.value);
}

/**
 * Resolves as true if the user can create any action-permission.
 *
 * Resolves as true if the user has the role Admin.
 */
export function canCreateActionPermission() {
    return auth.hasRole(userRoles.ADMIN.value);
}

/**
 * Resolves as true if the user can delete any action-permission.
 *
 * Resolves as true if the user has the role Admin.
 */
export function canDeleteActionPermission() {
    return auth.hasRole(userRoles.ADMIN.value);
}
