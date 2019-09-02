import { Entity } from '../entities/entity.model';
import { UserNotification } from './user-notification.model'
import { EntityPermission } from 'models/auth/entity-permission.model';

export interface UserNotificationBundle {
    notification: UserNotification;
    associatedEntity?: Entity;
    entityPermission?: EntityPermission;
}
