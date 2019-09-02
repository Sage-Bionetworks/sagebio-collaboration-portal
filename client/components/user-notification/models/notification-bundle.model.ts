// import { EntityPermission } from 'models/auth/entity-permission.model';
import { EntityAccessNotification } from '../models/entity-access-notificiation.model';
import { EntityNotification } from '../models/entity-notificiation.model';

import { Project } from 'models/entities/project.model';
import { Insight } from 'models/entities/insights/insight.model';


export interface NotificationBundle {
    notification: EntityNotification | EntityAccessNotification;
    associatedEntity: Project | Insight;
}
