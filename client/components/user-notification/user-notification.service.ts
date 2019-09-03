import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserNotificationSidenavComponent } from './user-notification-sidenav/user-notification-sidenav.component';
import { MessageNotification } from 'models/user-notification/message-notificiation.model'
import { EntityNotification } from 'models/user-notification/entity-notificiation.model'
import { EntityAccessNotification } from 'models/user-notification/entity-access-notificiation.model'

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


    queryMessageNotifications(query?: {}): Observable<MessageNotification[]> {
        return this.httpClient.get<MessageNotification[]>(`/api/user-notifications/message-notification${stringifyQuery(query)}`);
    }

    createMessageNotifications(messageNotification: MessageNotification): Observable<MessageNotification> {
        return this.httpClient.post<MessageNotification>(`/api/user-notifications/message-notification/${messageNotification.user}`, messageNotification);
    }

    queryEntityNotifications(query?: {}): Observable<EntityNotification[]> {
        return this.httpClient.get<EntityNotification[]>(`/api/user-notifications/entity-notification${stringifyQuery(query)}`);
    }

    createEntityNotification(entityNotification: EntityNotification): Observable<EntityNotification> {
        return this.httpClient.post<EntityNotification>(`/api/user-notifications/entity-notification/${entityNotification.user}`, entityNotification);
    }

    queryEntityAccessNotifications(query?: {}): Observable<EntityAccessNotification[]> {
        return this.httpClient.get<EntityAccessNotification[]>(`/api/user-notifications/entity-access-notification${stringifyQuery(query)}`);
    }

    createEntityAccessNotification(entityAccessNotification: EntityAccessNotification): Observable<EntityAccessNotification> {
        return this.httpClient.post<EntityAccessNotification>(`/api/user-notifications/entity-access-notificatioon/${entityAccessNotification.user}`, entityAccessNotification);
    }
}
