import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EntityAccessNotification } from 'models/auth/notificiation.model';
import { MessageNotification } from 'models/auth/notificiation.model';
import { EntityNotification } from 'models/auth/notificiation.model';

@Injectable()
export class NotificationService {
  static parameters = [HttpClient];
  constructor(private httpClient: HttpClient) { }

  queryMineEntityAccessNotifications(): Observable<EntityAccessNotification[]> {
    return this.httpClient.get<EntityAccessNotification[]>('/api/notifications/entity-access/mine');
  }

  createEntityAccessNotification(entityAccessNotification: EntityAccessNotification): Observable<EntityAccessNotification> {
    return this.httpClient.post<EntityAccessNotification>(`/api/notifications/entity-access/${entityAccessNotification.userId}`, entityAccessNotification);
  }

  queryMineEntityNotifications(): Observable<EntityNotification[]> {
    return this.httpClient.get<EntityNotification[]>('/api/notifications/entity/mine');
  }

  createEntityNotification(entityNotification: EntityNotification): Observable<EntityNotification> {
    return this.httpClient.post<EntityNotification>(`/api/notifications/entity/${entityNotification.userId}`, entityNotification);
  }

  queryMineMessageNotification(): Observable<MessageNotification[]> {
    return this.httpClient.get<MessageNotification[]>('/api/notifications/message/mine');
  }

  createMessageNotifications(messageNotification: MessageNotification): Observable<MessageNotification> {
    return this.httpClient.post<MessageNotification>(`/api/notifications/message/${messageNotification.userId}`, messageNotification);
  }
}

