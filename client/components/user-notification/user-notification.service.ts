import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserNotification } from 'models/user-notification/user-notification.model';
import { stringifyQuery } from 'components/util';

@Injectable()
export class UserNotificationService {

    static parameters = [HttpClient];
    constructor(private httpClient: HttpClient) { }

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
