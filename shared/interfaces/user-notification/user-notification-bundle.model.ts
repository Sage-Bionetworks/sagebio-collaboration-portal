import { Entity } from '../entities/entity.model';
import { UserNotification } from './user-notification.model'
import { EntityPermission } from 'models/auth/entity-permission.model';

export interface UserNotificationBundle<N extends UserNotification> {
    notification: N;
    associatedEntity?: Entity;
    entityPermission?: EntityPermission;
}
