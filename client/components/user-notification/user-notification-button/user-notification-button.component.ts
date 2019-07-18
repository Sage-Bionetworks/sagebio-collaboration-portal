import { Component, Input } from '@angular/core';

@Component({
    selector: 'user-notification-button',
    template: require('./user-notification-button.html'),
    styles: [require('./user-notification-button.scss')]
})
export class UserNotificationButtonComponent {

    static parameters = [];
    constructor() { }

    showNotifications(): void {

    }
}
