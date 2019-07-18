import { Component, OnDestroy } from '@angular/core';
import { SecondarySidenavService } from 'components/sidenav/secondary-sidenav/secondary-sidenav.service';

@Component({
    selector: 'user-notification-sidenav',
    template: require('./user-notification-sidenav.html'),
    styles: [require('./user-notification-sidenav.scss')]
})
export class UserNotificationSidenavComponent implements OnDestroy {

    static parameters = [SecondarySidenavService];
    constructor(private sidenavService: SecondarySidenavService) { }

    ngOnDestroy() {
    }

    close(): void {
        this.sidenavService.close();
        this.sidenavService.destroyContentComponent();
    }
}
