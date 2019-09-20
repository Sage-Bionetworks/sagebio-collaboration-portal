import { report2Id, report3Id } from './reports';
import { adminUserId, testUserId } from './users';
import { notificationTypes, entityTypes } from '../../environment/shared';

let entityNotifications = [
    {
        user: testUserId,
        archived: false,
        notificationType: notificationTypes.ENTITY_NOTIFICATION.value,
        entityId: report2Id,
        entityType: entityTypes.INSIGHT.value,
        createdBy: adminUserId,
    },
    {
        user: adminUserId,
        archived: false,
        notificationType: notificationTypes.ENTITY_NOTIFICATION.value,
        entityId: report3Id,
        entityType: entityTypes.INSIGHT.value,
        createdBy: testUserId,
    },
];

export { entityNotifications };
