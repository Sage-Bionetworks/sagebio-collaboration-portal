import * as auth from '../../auth/auth.service';
import { entityTypes, accessTypes, actionPermissionTypes } from '../../config/environment';
import Tool from './tool.model';

/**
 * Resolves as true if the user can read the Tool.
 */
export function canRead() {
    return auth.isAuthenticated();
    // TODO for now anyone can read a Tool
    // return auth.canReadEntity(
    //     auth.attachEntityAuthorizationDetails(Tool, entityTypes.TOOL.value),
    //     Object.values(accessTypes).map(access => access.value)
    // );
}

/**
 * Resolves as true if the user can create a new Tool.
 */
export function canCreate() {
    // return auth.canReadEntity(
    //     auth.attachEntityAuthorizationDetails(Tool, entityTypes.TOOL.value),
    //     Object.values(accessTypes).map(access => access.value)
    // );
    return auth.hasUserPermission(actionPermissionTypes.CREATE_TOOL.value);
}

/**
 * Resolves as true if the user has the entity permission ADMIN for the tool.
 */
export function canEdit() {
    return canAdmin();
}

/**
 * Resolves as true if the user has the entity permission ADMIN for the tool.
 */
export function canDelete() {
    return canAdmin();
}

// HELPER FUNCTIONS

/**
 * Resolves as true if the user has the entity permission ADMIN for the tool.
 */
export function canAdmin() {
    return auth.hasEntityPermission(auth.attachEntityAuthorizationDetails(Tool, entityTypes.TOOL.value), [
        accessTypes.ADMIN.value,
    ]);
}
