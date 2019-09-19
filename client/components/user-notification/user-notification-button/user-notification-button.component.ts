import { Component } from '@angular/core';
import { UserPermissionDataService } from 'components/auth/user-permission-data.service';
import { UserNotificationSidenavService } from '../user-notification-sidenav/user-notification-sidenav.service';

@Component({
    selector: 'user-notification-button',
    template: require('./user-notification-button.html'),
    styles: [require('./user-notification-button.scss')]
})
export class UserNotificationButtonComponent {
    private numNotifications = 0;

    static parameters = [UserNotificationSidenavService];
    constructor(private userNotificationSidenavService: UserNotificationSidenavService) {

        // this.userPermissionDataService.permissions()
        //     .subscribe(permissions => {
        //         this.numNotifications = permissions.countPendingEntityInvites();
        //     });
    }

    toggleNotifications(): void {
        this.userNotificationSidenavService.toggleNotifications();
    }
}
