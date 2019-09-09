import * as auth from '../../auth/auth.service';
import { actionPermissionTypes, userRoles } from '../../config/environment';

/**
 *
 */
export function canCreateUser() {
    return auth.hasUserPermission(actionPermissionTypes.CREATE_USER.value);
}

/**
 *
 */
export function canEditUser() {
    return auth.hasRole(userRoles.ADMIN.value);
}

/**
 *
 */
export function canChangeRole() {
    return auth.hasRole(userRoles.ADMIN.value);
}

/**
 *
 */
export function canDeleteUser() {
    return auth.hasRole(userRoles.ADMIN.value);
}
