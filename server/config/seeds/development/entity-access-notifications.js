// import { testProjectId, anotherProjectId } from './projects';
import { adminUserId, testUserId } from './users';
import { memo1Id } from './memos';
import { report1Id } from './reports';
import { entityPermission1Id, entityPermission2Id } from './entity-permissions';

import { notificationTypes, entityTypes } from '../../environment/shared';

let entityAccessNotifications = [{
    notificationType: notificationTypes.ENTITY_ACCESS_NOTIFICATION.value,
    userId: adminUserId,
    createdBy: testUserId,
    archived: false,
    entityId: memo1Id,
    entityType: entityTypes.INSIGHT.value,
    entityPermissionId: entityPermission1Id
},
{
    notificationType: notificationTypes.ENTITY_ACCESS_NOTIFICATION.value,
    userId: adminUserId,
    createdBy: testUserId,
    archived: false,
    entityId: report1Id,
    entityType: entityTypes.INSIGHT.value,
    entityPermissionId: entityPermission2Id
}];

export { entityAccessNotifications };
