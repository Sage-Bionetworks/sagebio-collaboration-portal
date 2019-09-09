import { Entity } from '../entities/entity.model';
import { UserNotification } from './user-notification.model'
import { EntityPermission } from 'models/auth/entity-permission.model';
import { EntityAccessNotification } from './entity-access-notificiation.model';
import { EntityNotification } from './entity-notificiation.model';

export interface UserNotificationBundle<N extends UserNotification> {
    notification: N;
    associatedEntity?: Entity;
    entityPermission?: EntityPermission;
}
