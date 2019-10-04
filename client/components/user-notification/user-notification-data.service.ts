import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserNotification } from 'models/user-notification/user-notification.model';
import { UserNotificationService } from './user-notification.service';
import { SocketService } from 'components/socket/socket.service';
import { orderBy, flow, filter } from 'lodash/fp';

@Injectable()
export class UserNotificationDataService implements OnDestroy {
    private notifications_ = new BehaviorSubject<UserNotification[]>([]);
    private notificationSocketModel: string;

    static parameters = [SocketService, UserNotificationService];
    constructor(private socketService: SocketService, private userNotificationService: UserNotificationService) {
        this.notificationSocketModel = 'notifications';
        // TODO: Need an endpoint to get only the archived notifications
        this.userNotificationService.queryNotifications({ archived: false }).subscribe(
            notifications => {
                this.notifications_.next(notifications);
                this.socketService.syncArraySubject(
                    this.notificationSocketModel,
                    this.notifications_,
                    (items: UserNotification[]) => {
                        // TODO: Remove when listening only to unarchive notifications
                        return flow(
                            filter<UserNotification>(n => !n.archived),
                            orderBy('createdAt', 'desc')
                        )(items);
                    }
                );
            },
            err => console.error(err)
        );
    }

    ngOnDestroy() {
        if (this.notificationSocketModel) {
            this.socketService.unsyncUpdates(this.notificationSocketModel);
        }
    }

    notifications(): Observable<UserNotification[]> {
        return this.notifications_.asObservable();
    }
}
