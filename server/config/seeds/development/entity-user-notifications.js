import { report2Id, report3Id } from './reports';
import { adminUserId, testUserId } from './users';
import { userNotificationTypes, entityTypes } from '../../environment';

let entityUserNotifications = [
    {
        user: testUserId,
        archived: false,
        userNotificationType: userNotificationTypes.ENTITY.value,
        entityId: report2Id,
        entityType: entityTypes.INSIGHT.value,
        createdBy: adminUserId,
    },
    {
        user: adminUserId,
        archived: false,
        userNotificationType: userNotificationTypes.ENTITY.value,
        entityId: report3Id,
        entityType: entityTypes.INSIGHT.value,
        createdBy: testUserId,
    },
];

export { entityUserNotifications };
