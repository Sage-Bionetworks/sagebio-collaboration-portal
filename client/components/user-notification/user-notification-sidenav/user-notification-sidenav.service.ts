import { Injectable } from '@angular/core';

import { UserNotificationSidenavComponent } from './user-notification-sidenav.component';
import { SecondarySidenavService } from 'components/sidenav/secondary-sidenav/secondary-sidenav.service';

const SIDENAV_CONTENT_ID = 'notifications';

@Injectable()
export class UserNotificationSidenavService {

    static parameters = [SecondarySidenavService];
    constructor(private secondarySidenavService: SecondarySidenavService) { }

    toggleNotifications(): void {
        if (this.secondarySidenavService.getContentId() !== SIDENAV_CONTENT_ID) {
            this.secondarySidenavService
                .loadContentComponent(UserNotificationSidenavComponent);
            this.secondarySidenavService.setContentId(SIDENAV_CONTENT_ID);
        }
        this.secondarySidenavService.toggle();
    }
}
