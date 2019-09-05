import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { NotificationService } from 'components/notification/notification.service';
import { UserNotificationService } from '../user-notification.service';
import config from '../../../app/app.constants';
import { MessageNotification } from 'models/user-notification/message-notificiation.model';
import { EntityNotification } from 'models/user-notification/entity-notificiation.model';
import { EntityAccessNotification } from 'models/user-notification/entity-access-notificiation.model';
import { Entity } from 'models/entities/entity.model';
import { Insight } from 'models/entities/insights/insight.model';

@Component({
    selector: 'user-notification-card',
    template: '',
    styles: [require('./user-notification-card.scss')]
})
export class UserNotificationCardComponent {
    @Input() notification: MessageNotification | EntityNotification | EntityAccessNotification;
    @Input() entity: Entity;

    static parameters = [Router, NotificationService, UserNotificationService];
    constructor(
        private router: Router,
        private notificationService: NotificationService,
        private userNotificationService: UserNotificationService
    ) { }

    goToEntity() {
      if (
        this.notification.notificationType === config.notificationTypes.ENTITY_NOTIFICATION.value ||
        this.notification.notificationType === config.notificationTypes.ENTITY_ACCESS_NOTIFICATION.value
      ) {
        const notification = this.notification as EntityNotification | EntityAccessNotification
        switch(notification.entityType) {
            case config.entityTypes.INSIGHT.value: {
                const insight = this.entity as Insight
                this.router.navigate(['/projects', insight.projectId, 'insights', insight._id]);
            }
            case config.entityTypes.PROJECT.value:
            case config.entityTypes.RESOURCE.value:
            case config.entityTypes.TOOL.value:
            case config.entityTypes.DATA_CATALOG.value:
            default:
                break;
        }
      }
    }

    discard() {
        this.userNotificationService.archiveNotification(this.notification).subscribe(() => {
            this.notificationService.info('Notification discarded.');
        })
    }
}
