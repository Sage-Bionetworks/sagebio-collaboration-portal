import { Component, AfterViewInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { EntityPermission } from 'models/auth/entity-permission.model';
import { UserPermissionDataService } from 'components/auth/user-permission-data.service';
import { NotificationService } from 'components/notification/notification.service';
import { InviteBundle } from '../models/invite-bundle.model';
import { UserNotificationService } from '../user-notification.service';

@Component({
    selector: 'user-notification-view',
    template: require('./user-notification-view.html'),
    styles: [require('./user-notification-view.scss')]
})
export class UserNotificationViewComponent implements AfterViewInit, OnDestroy {
    @Input() invite: InviteBundle;
    @Input() notification;

    static parameters = [Router, UserPermissionDataService,
        NotificationService, UserNotificationService, UserNotificationService];
    constructor(private router: Router,
        private userPermissionDataService: UserPermissionDataService,
        private notificationService: NotificationService,
        private userNotificationService: UserNotificationService) { }

    ngAfterViewInit() { }

    ngOnDestroy() { }

    accept(): void {
        this.userPermissionDataService.acceptEntityPermission(this.invite.invite)
            .subscribe(entityPermission => {
                this.notificationService.info('The invite has been successfully accepted.');
            }, err => {
                console.log(err);
                this.notificationService.error('Unable to accept the invite', err);
            });
    }

    acceptAndRedirect() {
        this.userPermissionDataService.acceptEntityPermission(this.invite.invite)
            .subscribe(entityPermission => {
                this.userNotificationService.toggleNotifications();
                this.notificationService.info('The invite has been successfully accepted.');
                this.router.navigate(['projects/', entityPermission.entityId]);
            }, err => {
                console.log(err);
                this.notificationService.error('Unable to accept the invite', err);
            });
    }

    decline(): void {
        this.userPermissionDataService.declineEntityPermission(this.invite.invite)
            .subscribe(entityPermission => {
                this.notificationService.info('The invite has been successfully declined.');
            }, err => {
                console.log(err);
                this.notificationService.error('Unable to decline the invite', err);
            });
    }
}
