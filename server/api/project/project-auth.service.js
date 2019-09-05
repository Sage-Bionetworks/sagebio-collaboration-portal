import compose from 'composable-middleware';
import {
    isAuthenticated,
    attachesEntityAuthorizationDetails,
    canReadEntity,
    canWriteEntity,
    canAdminEntity
} from '../../auth/auth.service';
import { accessTypes, userRoles, entityTypes } from '../../config/environment';
import Project from './project.model';

export function canReadProject() {
    return compose()
        .use(isAuthenticated())
        .use(attachesEntityAuthorizationDetails(Project, entityTypes.PROJECT.value))
        .use(canReadEntity());
}

export function canWriteProject() {
    return compose()
        .use(isAuthenticated())
        .use(attachesEntityAuthorizationDetails(Project, entityTypes.PROJECT.value))
        .use(canWriteEntity());
}

export function canAdminProject() {
    return compose()
        .use(isAuthenticated())
        .use(attachesEntityAuthorizationDetails(Project, entityTypes.PROJECT.value))
        .use(canAdminEntity());
}
