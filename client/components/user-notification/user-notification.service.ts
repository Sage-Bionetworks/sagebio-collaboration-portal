import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SecondarySidenavService } from 'components/sidenav/secondary-sidenav/secondary-sidenav.service';
import { UserNotificationSidenavComponent } from './user-notification-sidenav/user-notification-sidenav.component';
import { Observable } from 'rxjs';
import { MessageNotification } from './models/message-notificiation.model';
import { EntityNotification } from './models/entity-notificiation.model';
import { EntityAccessNotification } from './models/entity-access-notificiation.model';
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
        return this.httpClient.get<MessageNotification[]>(`/api/notifications/message${stringifyQuery(query)}`);
    }

    createMessageNotifications(messageNotification: MessageNotification): Observable<MessageNotification> {
        return this.httpClient.post<MessageNotification>(`/api/notifications/message/${messageNotification.userId}`, messageNotification);
    }

    queryEntityNotifications(query?: {}): Observable<EntityNotification[]> {
        return this.httpClient.get<EntityNotification[]>(`/api/notifications/entity${stringifyQuery(query)}`);
    }

    createEntityNotification(entityNotification: EntityNotification): Observable<EntityNotification> {
        return this.httpClient.post<EntityNotification>(`/api/notifications/entity/${entityNotification.userId}`, entityNotification);
    }

    queryEntityAccessNotifications(query?: {}): Observable<EntityAccessNotification[]> {
        return this.httpClient.get<EntityAccessNotification[]>(`/api/notifications/entity-access${stringifyQuery(query)}`);
    }

    createEntityAccessNotification(entityAccessNotification: EntityAccessNotification): Observable<EntityAccessNotification> {
        return this.httpClient.post<EntityAccessNotification>(`/api/notifications/entity-access/${entityAccessNotification.userId}`, entityAccessNotification);
    }
}
