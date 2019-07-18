import { testProjectId } from './projects';
import { adminUserId, testUserId } from './users';
import {
    accessTypes,
    entityTypes,
    inviteStatusTypes,
} from '../../environment/shared';

let entityPermissions = [
    {
        status: inviteStatusTypes.ACCEPTED.value,
        entityId: testProjectId,
        entityType: entityTypes.PROJECT.value,
        user: testUserId,
        access: accessTypes.READ.value,
        createdBy: adminUserId,
    },
];

export { entityPermissions };
