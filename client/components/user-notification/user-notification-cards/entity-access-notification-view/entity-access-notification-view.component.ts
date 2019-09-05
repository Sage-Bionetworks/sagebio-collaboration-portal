import { Component, AfterViewInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'components/notification/notification.service';
import { UserNotificationService } from '../../user-notification.service';
// import { EntityAccessNotification } from '../models/entity-access-notificiation.model';
// import { NotificationBundle } from '../models/notification-bundle.model';
import { UserNotificationBundle } from 'models/user-notification/user-notification-bundle.model'
import { EntityAccessNotification } from 'models/user-notification/entity-access-notificiation.model';

@Component({
    selector: 'entity-access-notification-view',
    template: require('./entity-access-notification-view.html'),
    styles: [require('../user-notification-card.scss')]
})
export class EntityAccessNotificationViewComponent implements AfterViewInit, OnDestroy {
    @Input() entityAccessNotification: UserNotificationBundle<EntityAccessNotification>;

    static parameters = [Router,
        NotificationService, UserNotificationService, UserNotificationService];
    constructor(private router: Router,
        private notificationService: NotificationService,
        private userNotificationService: UserNotificationService) { }

    ngAfterViewInit() { }

    ngOnDestroy() { }

    acceptAccessInvite(): void {
        this.notificationService.info('entityAccessNotification Accepted.');
    }

    discard() {
        this.notificationService.info('The entityAccessNotification has been successfully archived.');
    }

    acceptAndRedirect(): void {
        this.notificationService.info('The entityAccessNotification has been acepted and now redirecting');

    }


}
