import * as auth from '../../auth/auth.service';
import { entityTypes, accessTypes, actionPermissionTypes } from '../../config/environment';
import Tool from './tool.model';

/**
 * Resolves as true if the tool is public OR if the user has at least the
 * entity permission READ for the tool.
 */
export function canReadTool() {
    return auth.canReadEntity(
        auth.attachEntityAuthorizationDetails(Tool, entityTypes.TOOL.value),
        Object.values(accessTypes).map(access => access.value)
    );
}

/**
 * Resolves as true if the user has the action permission CREATE_TOOL.
 */
export function canCreateTool() {
    return auth.hasUserPermission(actionPermissionTypes.CREATE_DATA_CATALOG.value);
}

/**
 * Resolves as true if the user has the entity permission ADMIN for the tool.
 */
export function canEditTool() {
    return canAdminTool();
}

/**
 * Resolves as true if the user has the entity permission ADMIN for the tool.
 */
export function canDeleteTool() {
    return canAdminTool();
}

// HELPER FUNCTIONS

/**
 * Resolves as true if the user has the entity permission ADMIN for the tool.
 */
export function canAdminTool() {
    return auth.hasEntityPermission(
        auth.attachEntityAuthorizationDetails(Tool, entityTypes.TOOL.value),
        [accessTypes.ADMIN.value]
    );
}
