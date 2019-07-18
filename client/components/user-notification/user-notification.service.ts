import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SecondarySidenavService } from 'components/sidenav/secondary-sidenav/secondary-sidenav.service';
import { UserNotificationSidenavComponent } from './user-notification-sidenav/user-notification-sidenav.component';

@Injectable()
export class UserNotificationService {

    static parameters = [HttpClient, SecondarySidenavService];
    constructor(private httpClient: HttpClient,
        private secondarySidenavService: SecondarySidenavService) { }

    showNotifications(): void {
        let sidenavContentId = `notifications`;
        if (this.secondarySidenavService.getContentId() !== sidenavContentId) {
            // (<UserNotificationSidenavComponent>this.secondarySidenavService
            //     .loadContentComponent(UserNotificationSidenavComponent))
            //     .setMessage(message);
            this.secondarySidenavService
                .loadContentComponent(UserNotificationSidenavComponent);
            this.secondarySidenavService.setContentId(sidenavContentId);
        }
        this.secondarySidenavService.open();
    }
}
