import { Component, AfterViewInit, OnDestroy, Input } from '@angular/core';
import { EntityPermission } from 'models/auth/entity-permission.model';
import { UserPermissionDataService } from 'components/auth/user-permission-data.service';
import { InviteBundle } from '../models/invite-bundle.model';
import { NotificationService } from 'components/notification/notification.service';

@Component({
    selector: 'user-notification-view',
    template: require('./user-notification-view.html'),
    styles: [require('./user-notification-view.scss')]
})
export class UserNotificationViewComponent implements AfterViewInit, OnDestroy {
    @Input() invite: InviteBundle;

    static parameters = [UserPermissionDataService, NotificationService];
    constructor(private userPermissionDataService: UserPermissionDataService,
        private notificationService: NotificationService) { }

    ngAfterViewInit() { }

    ngOnDestroy() { }

    accept(): void {
        this.notificationService.info('Not implemented yet');
    }

    acceptAndRedirect() {
        this.notificationService.info('Not implemented yet');
    }

    decline(): void {
        this.notificationService.info('Not implemented yet');
    }
}
