import { adminUserId, testUserId } from './users';
import { actionPermissionTypes } from '../../environment';

let actionPermissions = [
    {
        user: testUserId,
        action: actionPermissionTypes.CREATE_PROJECT.value,
        createdBy: adminUserId,
    },
];

export { actionPermissions };
