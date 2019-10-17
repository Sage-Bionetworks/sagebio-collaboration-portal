import { Component, OnInit } from '@angular/core';
import { UserNotificationSidenavService } from '../user-notification-sidenav/user-notification-sidenav.service';
import { UserNotificationDataService } from '../user-notification-data.service';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { PageTitleService } from 'components/page-title/page-title.service';

@Component({
    selector: 'user-notification-button',
    template: require('./user-notification-button.html'),
    styles: [require('./user-notification-button.scss')],
})
export class UserNotificationButtonComponent implements OnInit {
    private numNotifications$: Observable<number>; // used in html

    static parameters = [UserNotificationDataService, UserNotificationSidenavService, PageTitleService];
    constructor(
        private userNotificationDataService: UserNotificationDataService,
        private userNotificationSidenavService: UserNotificationSidenavService,
        private pageTitleService: PageTitleService
    ) {}

    ngOnInit() {
        this.numNotifications$ = this.userNotificationDataService.notifications().pipe(
            tap(notifications => this.pageTitleService.setNumNotifications(notifications.length)),
            map(notifications => notifications.length)
        );
    }

    toggleNotifications(): void {
        this.userNotificationSidenavService.toggleNotifications();
    }
}
