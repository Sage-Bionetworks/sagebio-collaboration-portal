import { adminUserId, testUserId } from './users';
import { notificationTypes } from '../../environment/shared';

let messageNotifications = [{
    notificationType: notificationTypes.MESSAGE_NOTIFICATION.value,
    user: adminUserId,
    createdBy: testUserId,
    archived: false,
    messageBody: 'test message body'
},
{
    notificationType: notificationTypes.MESSAGE_NOTIFICATION.value,
    user: testUserId,
    createdBy: adminUserId,
    archived: false,
    messageBody: 'test message 2'
}];

export { messageNotifications };
