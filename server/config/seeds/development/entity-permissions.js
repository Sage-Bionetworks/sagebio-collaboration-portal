import {
    testProjectId,
    anotherProjectId
} from './projects';
import {
    adminUserId,
    testUserId
} from './users';
import {
    accessTypes,
    entityTypes,
    inviteStatusTypes,
} from '../../environment/shared';

let entityPermissions = [{
    status: inviteStatusTypes.ACCEPTED.value,
    entityId: testProjectId,
    entityType: entityTypes.PROJECT.value,
    user: adminUserId,
    access: accessTypes.ADMIN.value,
    createdBy: adminUserId,
}, {
    status: inviteStatusTypes.ACCEPTED.value,
    entityId: anotherProjectId,
    entityType: entityTypes.PROJECT.value,
    user: testUserId,
    access: accessTypes.ADMIN.value,
    createdBy: testUserId,
}];

export {
    entityPermissions
};
