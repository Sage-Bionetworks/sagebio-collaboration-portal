import { Component, AfterViewInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'components/notification/notification.service';
import { UserNotificationService } from '../user-notification.service';
// import { EntityAccessNotification } from '../models/entity-access-notificiation.model';
// import { NotificationBundle } from '../models/notification-bundle.model';
import { UserNotificationBundle } from 'models/user-notification/user-notification-bundle.model'

@Component({
    selector: 'entity-access-notification-view',
    template: require('./entity-access-notification-view.html'),
    styles: [require('./entity-access-notification-view.scss')]
})
export class EntityAccessNotificationViewComponent implements AfterViewInit, OnDestroy {
    @Input() entityAccessInvite: UserNotificationBundle;

    static parameters = [Router,
        NotificationService, UserNotificationService, UserNotificationService];
    constructor(private router: Router,
        private notificationService: NotificationService,
        private userNotificationService: UserNotificationService) { }

    ngAfterViewInit() { }

    ngOnDestroy() { }

    acceptAccessInvite(): void {
        this.notificationService.info('entityAccessInvite Accepted.');
    }

    archive() {
        this.notificationService.info('The entityAccessInvite has been successfully archived.');
    }


}
