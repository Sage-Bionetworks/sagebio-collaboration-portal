import * as auth from '../../auth/auth.service';
import { userRoles } from '../../config/environment';


export function canReadEntityPermission() {
    return auth.hasRole(userRoles.ADMIN.value); // TODO change to the ADMIN of the entity
    //auth.canAccessEntity([ADMIN_ACCESS])
}

export function canCreateEntityPermission() {
    return auth.hasRole(userRoles.ADMIN.value); // TODO change to the admin of the entity
    //auth.canAccessEntity([ADMIN_ACCESS])
}

export function canEditEntityPermission() {
    return auth.hasRole(userRoles.ADMIN.value); // TODO change to the admin of the entity
    //auth.canAccessEntity([ADMIN_ACCESS])
}

export function canDeleteEntityPermission() {
    return auth.hasRole(userRoles.ADMIN.value); // TODO change to the admin of the entity
    //auth.canAccessEntity([ADMIN_ACCESS])
}
