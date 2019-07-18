import { Component, Input } from '@angular/core';
import { UserNotificationService } from '../user-notification.service';

@Component({
    selector: 'user-notification-button',
    template: require('./user-notification-button.html'),
    styles: [require('./user-notification-button.scss')]
})
export class UserNotificationButtonComponent {

    static parameters = [UserNotificationService];
    constructor(private userNotificationService: UserNotificationService) { }

    showNotifications(): void {
        this.userNotificationService.showNotifications();
    }
}
