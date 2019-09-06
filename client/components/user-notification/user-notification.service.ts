import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserNotificationSidenavComponent } from './user-notification-sidenav/user-notification-sidenav.component';
import { UserNotification } from 'models/user-notification/user-notification.model';

import { SecondarySidenavService } from 'components/sidenav/secondary-sidenav/secondary-sidenav.service';
import { stringifyQuery } from 'components/util';

const SIDENAV_CONTENT_ID = 'notifications';

@Injectable()
export class UserNotificationService {

    static parameters = [HttpClient, SecondarySidenavService];
    constructor(private httpClient: HttpClient,
        private secondarySidenavService: SecondarySidenavService) { }

    toggleNotifications(): void {
        if (this.secondarySidenavService.getContentId() !== SIDENAV_CONTENT_ID) {
            this.secondarySidenavService
                .loadContentComponent(UserNotificationSidenavComponent);
            this.secondarySidenavService.setContentId(SIDENAV_CONTENT_ID);
        }
        this.secondarySidenavService.toggle();
    }

    queryNotifications(query?: {}): Observable<UserNotification[]> {
        return this.httpClient.get<UserNotification[]>(`/api/user-notifications${stringifyQuery(query)}`);
    }

    archiveNotification(notification: UserNotification): Observable<UserNotification> {
        return this.httpClient.patch<UserNotification>(`/api/user-notifications/${notification._id}/archive`, []);
    }

    createNotification<N extends UserNotification>(notification: N): Observable<N> {
        return this.httpClient.post<N>('/api/user-notifications/', notification);
    }

}
