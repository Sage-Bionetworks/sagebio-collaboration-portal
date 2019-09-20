import { adminUserId, testUserId } from './users';
import { notificationTypes } from '../../environment/shared';

let messageNotifications = [
    {
        user: adminUserId,
        archived: false,
        notificationType: notificationTypes.MESSAGE_NOTIFICATION.value,
        message: 'test message body',
        createdBy: testUserId,
    },
    {
        user: testUserId,
        archived: false,
        notificationType: notificationTypes.MESSAGE_NOTIFICATION.value,
        message: 'test message 2',
        createdBy: adminUserId,
    },
];

export { messageNotifications };
