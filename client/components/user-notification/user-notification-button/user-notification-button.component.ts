import { Component, OnInit } from '@angular/core';
import { UserNotificationSidenavService } from '../user-notification-sidenav/user-notification-sidenav.service';
import { UserNotificationDataService } from '../user-notification-data.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'user-notification-button',
    template: require('./user-notification-button.html'),
    styles: [require('./user-notification-button.scss')],
})
export class UserNotificationButtonComponent implements OnInit {
    private numNotifications$: Observable<number>; // used in html

    static parameters = [UserNotificationDataService, UserNotificationSidenavService];
    constructor(
        private userNotificationDataService: UserNotificationDataService,
        private userNotificationSidenavService: UserNotificationSidenavService
    ) {}

    ngOnInit() {
        this.numNotifications$ = this.userNotificationDataService
            .notifications()
            .pipe(map(notifications => notifications.length));
    }

    toggleNotifications(): void {
        this.userNotificationSidenavService.toggleNotifications();
    }
}
