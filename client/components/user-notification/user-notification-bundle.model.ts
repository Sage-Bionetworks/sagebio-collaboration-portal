import { Entity } from 'models/entities/entity.model';
import { UserNotification } from 'models/user-notification/user-notification.model';
import { EntityPermission } from 'models/auth/entity-permission.model';

export interface UserNotificationBundle<N extends UserNotification> {
    notification: N;
    associatedEntity?: Entity;
    entityPermission?: EntityPermission;
}
