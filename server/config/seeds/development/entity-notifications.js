import { report2Id, report3Id } from './reports';
import { adminUserId, testUserId } from './users';

import { notificationTypes, entityTypes } from '../../environment/shared';

let entityNotifications = [
    {
        notificationType: notificationTypes.ENTITY_NOTIFICATION.value,
        user: testUserId,
        createdBy: adminUserId,
        archived: false,
        entityId: report2Id,
        entityType: entityTypes.INSIGHT.value,
    },
    {
        notificationType: notificationTypes.ENTITY_NOTIFICATION.value,
        user: adminUserId,
        createdBy: testUserId,
        archived: false,
        entityId: report3Id,
        entityType: entityTypes.INSIGHT.value,
    },
];

export { entityNotifications };
