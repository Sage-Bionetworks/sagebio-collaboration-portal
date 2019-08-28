import { Component, AfterViewInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'components/notification/notification.service';
import { UserNotificationService } from '../user-notification.service';
import { EntityNotification } from '../models/entity-notificiation.model';


@Component({
    selector: 'entity-notification-view',
    template: require('./entity-notification-view.html'),
    styles: [require('./entity-notification-view.scss')]
})
export class EntityNotificationViewComponent implements AfterViewInit, OnDestroy {
    @Input() entityInvite: EntityNotification;

    static parameters = [Router,
        NotificationService, UserNotificationService, UserNotificationService];
    constructor(private router: Router,
        private notificationService: NotificationService,
        private userNotificationService: UserNotificationService) { }

    ngAfterViewInit() { }

    ngOnDestroy() { }

    AcceptInvite(): void {
        this.notificationService.info('entityInvite Accepted.');
    }

    archive() {
        this.notificationService.info('The entityInvite has been successfully archived.');
    }


}
