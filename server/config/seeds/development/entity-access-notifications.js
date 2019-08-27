import { entityPermissionInsightTypeId, entityPermissionInsightType2Id } from './entity-permissions';
import { adminUserId, testUserId } from './users';
import { memo1Id } from './memos';
import { report1Id } from './reports';
import { notificationTypes, entityTypes } from '../../environment/shared';

let entityAccessNotifications = [{
    notificationType: notificationTypes.ENTITY_ACCESS_NOTIFICATION.value,
    userId: adminUserId,
    createdBy: testUserId,
    archived: false,
    entityId: memo1Id,
    entityType: entityTypes.INSIGHT.value,
    entityPermissionId: entityPermissionInsightTypeId
},
{
    notificationType: notificationTypes.ENTITY_ACCESS_NOTIFICATION.value,
    userId: adminUserId,
    createdBy: testUserId,
    archived: false,
    entityId: report1Id,
    entityType: entityTypes.INSIGHT.value,
    entityPermissionId: entityPermissionInsightType2Id
}];

export { entityAccessNotifications };
