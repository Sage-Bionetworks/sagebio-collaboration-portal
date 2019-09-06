import { adminUserId, testUserId } from './users';
import { actionPermissionTypes } from '../../environment';

let userPermissions = [
    {
        user: testUserId,
        permission: actionPermissionTypes.CREATE_PROJECT.value,
        createdBy: adminUserId,
    },
];

export { userPermissions };
