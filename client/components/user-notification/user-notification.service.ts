import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SecondarySidenavService } from 'components/sidenav/secondary-sidenav/secondary-sidenav.service';
import { UserNotificationSidenavComponent } from './user-notification-sidenav/user-notification-sidenav.component';

const SIDENAV_CONTENT_ID = 'notifications';

@Injectable()
export class UserNotificationService {

    static parameters = [HttpClient, SecondarySidenavService];
    constructor(private httpClient: HttpClient,
        private secondarySidenavService: SecondarySidenavService) { }

    toggleNotifications(): void {
        if (this.secondarySidenavService.getContentId() !== SIDENAV_CONTENT_ID) {
            // (<UserNotificationSidenavComponent>this.secondarySidenavService
            //     .loadContentComponent(UserNotificationSidenavComponent))
            //     .setMessage(message);
            this.secondarySidenavService
                .loadContentComponent(UserNotificationSidenavComponent);
            this.secondarySidenavService.setContentId(SIDENAV_CONTENT_ID);
        }
        this.secondarySidenavService.toggle();
    }
}
