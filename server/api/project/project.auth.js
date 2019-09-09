import * as auth from '../../auth/auth.service';
import { entityTypes, accessTypes, actionPermissionTypes } from '../../config/environment';
import Project from './project.model';

/**
 * Resolves as true if the project is public OR if the user has at least the
 * entity permission READ for the project.
 */
export function canReadProject() {
    return auth.canReadEntity(
        auth.attachEntityAuthorizationDetails(Project, entityTypes.PROJECT.value),
        Object.values(accessTypes).map(access => access.value)
    );
}

/**
 * Resolves as true if the user has the action permission CREATE_PROJECT.
 */
export function canCreateProject() {
    return auth.hasUserPermission(actionPermissionTypes.CREATE_PROJECT.value);
}

/**
 * Resolves as true if the user has the entity permission ADMIN for the project.
 */
export function canEditProject() {
    return canAdminProject();
}

/**
 * Resolves as true if the user has the entity permission ADMIN for the project.
 */
export function canDeleteProject() {
    return canAdminProject();
}

// HELPER FUNCTIONS

/**
 * Resolves as true if the user has the entity permission ADMIN for the project.
 */
export function canAdminProject() {
    return auth.hasEntityPermission(
        auth.attachEntityAuthorizationDetails(Project, entityTypes.PROJECT.value),
        [accessTypes.ADMIN.value]
    );
}
