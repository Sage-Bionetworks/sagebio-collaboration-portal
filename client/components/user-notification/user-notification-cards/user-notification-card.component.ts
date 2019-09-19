import { Component, Input, Injector } from '@angular/core';
import { Router } from '@angular/router';

import { NotificationService } from 'components/notification/notification.service';
import { UserNotificationService } from '../user-notification.service';
import config from '../../../app/app.constants';
import { MessageNotification } from 'models/user-notification/message-notificiation.model';
import { EntityNotification } from 'models/user-notification/entity-notificiation.model';
import { EntityAccessNotification } from 'models/user-notification/entity-access-notificiation.model';
import { Entity } from 'models/entities/entity.model';
import { Insight } from 'models/entities/insights/insight.model';
import { Project } from 'models/entities/project.model';
import { Resource } from 'models/entities/resources/resource.model';
import { Tool } from 'models/entities/tool.model';
import { DataCatalog } from 'models/entities/data-catalog.model';

@Component({
    selector: 'user-notification-card',
    template: '',
    styles: [require('./user-notification-card.scss')],
})
export class UserNotificationCardComponent {
    @Input() notification: MessageNotification | EntityNotification | EntityAccessNotification;
    @Input() entity: Entity;

    archived: boolean = false;
    router: Router;
    notificationService: NotificationService;
    userNotificationService: UserNotificationService;

    static parameters = [Injector];
    constructor(public injector: Injector) {
        this.router = this.injector.get(Router);
        this.notificationService = this.injector.get(NotificationService);
        this.userNotificationService = this.injector.get(UserNotificationService);
    }

    goToEntity() {
        if (
            this.notification.notificationType === config.notificationTypes.ENTITY_NOTIFICATION.value ||
            this.notification.notificationType === config.notificationTypes.ENTITY_ACCESS_NOTIFICATION.value
        ) {
            const notification = this.notification as EntityNotification | EntityAccessNotification;
            switch (notification.entityType) {
                case config.entityTypes.INSIGHT.value: {
                    const insight = this.entity as Insight;
                    this.router.navigate(['/projects', insight.projectId, 'insights', insight._id]);
                    break;
                }
                case config.entityTypes.PROJECT.value: {
                    const project = this.entity as Project;
                    this.router.navigate(['/projects', project._id]);
                    break;
                }
                case config.entityTypes.RESOURCE.value: {
                    const resource = this.entity as Resource;
                    this.router.navigate(['/projects', resource.projectId, 'resources', resource._id]);
                    break;
                }
                case config.entityTypes.TOOL.value: {
                    const tool = this.entity as Tool;
                    this.router.navigate(['/tools', tool._id]);
                    break;
                }
                case config.entityTypes.DATA_CATALOG.value: {
                    const catalog = this.entity as DataCatalog;
                    this.router.navigate(['/data-catalogs', catalog._id]);
                    break;
                }
                default:
                    break;
            }
        }
    }

    archive() {
        return this.userNotificationService.archive(this.notification);
    }

    discard() {
        this.archive().subscribe(() => {
            this.archived = true;
            this.notificationService.info('Notification discarded.');
        });
    }
}
