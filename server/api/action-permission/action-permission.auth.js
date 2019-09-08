import * as auth from '../../auth/auth.service';
import { userRoles } from '../../config/environment';

export function canReadActionPermissionsByUser() {
    return auth.hasRole(userRoles.ADMIN.value);
}
