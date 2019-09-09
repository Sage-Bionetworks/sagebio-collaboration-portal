import * as auth from '../../auth/auth.service';
import { actionPermissionTypes, userRoles } from '../../config/environment';

/**
 * Resolves as true if the user has the action permission CREATE_ORGANIZATION.
 */
export function canCreateOrganization() {
    return auth.hasUserPermission(actionPermissionTypes.CREATE_ORGANIZATION.value);
}

/**
 * Resolves as true if the user has the entity permission ADMIN for the organization.
 */
export function canEditOrganization() {
    return auth.hasRole(userRoles.ADMIN.value);
}

/**
 * Resolves as true if the user has the entity permission ADMIN for the organization.
 */
export function canDeleteOrganization() {
    return auth.hasRole(userRoles.ADMIN.value);
}
