import compose from 'composable-middleware';
import * as auth from '../../auth/auth.service';
import * as authBase from '../../auth/auth';
import { entityTypes, accessTypes, actionPermissionTypes } from '../../config/environment';
import DataCatalog from './data-catalog.model';

/**
 * Resolves as true if the data catalog is public OR if the user has at least the
 * entity permission READ for the data catalog.
 */
export function canReadDataCatalog() {
    return auth.canReadEntity(
        auth.attachEntityAuthorizationDetails(DataCatalog, entityTypes.DATA_CATALOG.value),
        Object.values(accessTypes).map(access => access.value)
    );
}

/**
 * Resolves as true if the user has the action permission CREATE_DATA_CATALOG.
 */
export function canCreateDataCatalog() {
    return auth.hasUserPermission(actionPermissionTypes.CREATE_DATA_CATALOG.value);
}

/**
 * Resolves as true if the user has the entity permission ADMIN for the data catalog.
 */
export function canEditDataCatalog() {
    return canAdminDataCatalog();
}

/**
 * Resolves as true if the user has the entity permission ADMIN for the data catalog.
 */
export function canDeleteDataCatalog() {
    return canAdminDataCatalog();
}

// HELPER FUNCTIONS

/**
 * Resolves as true if the user has the entity permission ADMIN for the data catalog.
 */
export function canAdminDataCatalog() {
    return auth.hasEntityPermission(
        auth.attachEntityAuthorizationDetails(DataCatalog, entityTypes.DATA_CATALOG.value),
        [accessTypes.ADMIN.value]
    );
}
