import { Component, AfterViewInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'components/notification/notification.service';
import { UserNotificationService } from '../../user-notification.service';
import { UserNotificationBundle } from 'models/user-notification/user-notification-bundle.model'
import { EntityNotification } from 'models/user-notification/entity-notificiation.model';
import config from '../../../../app/app.constants';
import { Insight } from 'models/entities/insights/insight.model';

// import { EntityNotification } from '../models/entity-notificiation.model';
// import { NotificationBundle } from '../models/notification-bundle.model';


@Component({
    selector: 'entity-notification-view',
    template: require('./entity-notification-view.html'),
    styles: [require('../user-notification-view.scss')]
})
export class EntityNotificationViewComponent implements AfterViewInit, OnDestroy {
    @Input() entityNotification: UserNotificationBundle<EntityNotification>;
    static parameters = [Router,
        NotificationService, UserNotificationService, UserNotificationService];
    constructor(private router: Router,
        private notificationService: NotificationService,
        private userNotificationService: UserNotificationService) { }

    ngAfterViewInit() { }

    ngOnDestroy() { }

    goToEntity() {
        switch(this.entityNotification.notification.entityType) {
            case config.entityTypes.INSIGHT.value: {
                const insight = this.entityNotification.associatedEntity as Insight
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

    discard() {
        this.notificationService.info('The entityNotification has been successfully archived.');
    }
}
