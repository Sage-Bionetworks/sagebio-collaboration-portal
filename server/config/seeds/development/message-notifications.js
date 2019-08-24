// import { testProjectId, anotherProjectId } from './projects';
import { adminUserId, testUserId } from './users';

import { notificationTypes } from '../../environment/shared';

let messageNotifications = [{
    notificationType: notificationTypes.MESSAGE_NOTIFICATION.value,
    userId: adminUserId,
    createdBy: testUserId,
    archived: false,
    messageBody: 'test message body'
},
{
    notificationType: notificationTypes.MESSAGE_NOTIFICATION.value,
    userId: adminUserId,
    createdBy: testUserId,
    archived: false,
    messageBody: 'test message 2'
}];

export { messageNotifications };
