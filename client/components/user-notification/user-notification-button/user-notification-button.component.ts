import { Component, Input } from '@angular/core';
import { UserPermissionDataService } from 'components/auth/user-permission-data.service';
import { UserNotificationService } from '../user-notification.service';

@Component({
    selector: 'user-notification-button',
    template: require('./user-notification-button.html'),
    styles: [require('./user-notification-button.scss')]
})
export class UserNotificationButtonComponent {
    private numNotifications = 0;

    static parameters = [UserPermissionDataService, UserNotificationService];
    constructor(private userPermissionDataService: UserPermissionDataService,
        private userNotificationService: UserNotificationService) {

        this.userPermissionDataService.getPermissions()
            .subscribe(permissions => {
                this.numNotifications = permissions.countPendingEntityInvites();
            });
    }

    toggleNotifications(): void {
        this.userNotificationService.toggleNotifications();
    }
}
