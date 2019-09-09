import * as auth from '../../auth/auth.service';
import { actionPermissionTypes, userRoles } from '../../config/environment';

/**
 *
 */
export function canCreateOrganization() {
    return auth.hasUserPermission(actionPermissionTypes.CREATE_ORGANIZATION.value);
}

/**
 *
 */
export function canEditOrganization() {
    return auth.hasRole(userRoles.ADMIN.value);
}

/**
 *
 */
export function canDeleteOrganization() {
    return auth.hasRole(userRoles.ADMIN.value);
}
