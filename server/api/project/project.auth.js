import {
    attachEntityAuthorizationDetails,
    canReadEntity,
    hasEntityPermission
} from '../../auth/auth.service';
import { entityTypes, accessTypes } from '../../config/environment';
import Project from './project.model';

export function canReadProject() {
    return canReadEntity(
        attachEntityAuthorizationDetails(Project, entityTypes.PROJECT.value),
        Object.values(accessTypes).map(access => access.value)
    );
}

export function canAdminProject() {
    return hasEntityPermission(attachEntityAuthorizationDetails(Project, entityTypes.PROJECT.value), [
        accessTypes.ADMIN.value,
    ]);
}
