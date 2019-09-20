import { adminUserId, testUserId } from './users';
import { userNotificationTypes } from '../../environment';

console.log('VALUE', userNotificationTypes.MESSAGE.value);

let messageUserNotifications = [
    {
        user: adminUserId,
        archived: false,
        userNotificationType: 'Message', // userNotificationTypes.MESSAGE.value
        message: 'test message body',
        createdBy: testUserId,
    },
    {
        user: testUserId,
        archived: false,
        userNotificationType: 'Message', // userNotificationTypes.MESSAGE.value
        message: 'test message 2',
        createdBy: adminUserId,
    },
];

export { messageUserNotifications };
