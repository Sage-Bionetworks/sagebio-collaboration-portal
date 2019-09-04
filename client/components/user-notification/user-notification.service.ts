import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserNotificationSidenavComponent } from './user-notification-sidenav/user-notification-sidenav.component';
import { MessageNotification } from 'models/user-notification/message-notificiation.model'
import { EntityNotification } from 'models/user-notification/entity-notificiation.model'
import { EntityAccessNotification } from 'models/user-notification/entity-access-notificiation.model'
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
            // (<UserNotificationSidenavComponent>this.secondarySidenavService
            //     .loadContentComponent(UserNotificationSidenavComponent))
            //     .setMessage(message);
            this.secondarySidenavService
                .loadContentComponent(UserNotificationSidenavComponent);
            this.secondarySidenavService.setContentId(SIDENAV_CONTENT_ID);
        }
        this.secondarySidenavService.toggle();
    }

    // archiveNotification(notification: UserNotification) {
    //     return this.httpClient.patch<UserNotification>();
    // }

    queryNotifications(query?: {}): Observable<UserNotification[]> {
        return this.httpClient.get<UserNotification[]>(`/api/user-notifications${stringifyQuery(query)}`);
    }

    // createNotifications(messageNotification: MessageNotification): Observable<MessageNotification> {
    //     return this.httpClient.post<MessageNotification>(`/api/user-notifications/message-notification/${messageNotification.user}`, messageNotification);
    // }

}
