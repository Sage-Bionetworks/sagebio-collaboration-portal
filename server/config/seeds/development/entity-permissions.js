import { testProjectId } from './projects';
import { adminUserId, testUserId } from './users';
import { accessTypes, entityTypes, inviteStatusTypes } from '../../environment/shared';

let entityPermissions = [
    {
        status: inviteStatusTypes.PENDING.value,
        entityId: testProjectId,
        entityType: entityTypes.PROJECT.value,
        user: adminUserId,
        access: accessTypes.READ.value,
        createdBy: testUserId,
    },
];

export { entityPermissions };
