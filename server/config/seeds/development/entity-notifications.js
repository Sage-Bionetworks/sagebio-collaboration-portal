// import { testProjectId, anotherProjectId } from './projects';
import { adminUserId, testUserId } from './users';
import {
    report2Id, report3Id
} from './reports';

import { notificationTypes, entityTypes } from '../../environment/shared';

let entityNotifications = [{
    notificationType: notificationTypes.ENTITY_NOTIFICATION.value,
    userId: adminUserId,
    createdBy: testUserId,
    archived: false,
    entityId: report2Id,
    entityType: entityTypes.INSIGHT.value
},
{
    notificationType: notificationTypes.ENTITY_NOTIFICATION.value,
    userId: adminUserId,
    createdBy: testUserId,
    archived: false,
    entityId: report3Id,
    entityType: entityTypes.INSIGHT.value
}];

export { entityNotifications };
