import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { switchMap, map, tap } from 'rxjs/operators';
import { orderBy, flow, filter } from 'lodash/fp';
import { UserNotification } from 'models/user-notification/user-notification.model';
import { AuthService } from 'components/auth/auth.service';
import { SocketService } from 'components/socket/socket.service';
import { UserNotificationService } from './user-notification.service';

@Injectable()
export class UserNotificationDataService implements OnDestroy {
    private notifications_ = new BehaviorSubject<UserNotification[]>([]);
    private notificationsSub: Subscription;
    private notificationSocketModel: string;

    static parameters = [AuthService, SocketService, UserNotificationService];
    constructor(
        private authService: AuthService,
        private socketService: SocketService,
        private userNotificationService: UserNotificationService
    ) {
        this.notificationSocketModel = 'notifications';

        this.notificationsSub = this.authService
            .authInfo()
            .pipe(
                map(authInfo => authInfo.isLoggedIn()),
                switchMap(isLoggedIn => {
                    if (isLoggedIn) {
                        // TODO: Need an endpoint to get only the archived notifications + paginated + for websocket
                        return this.userNotificationService.queryNotifications({ archived: false });
                    } else {
                        return of<UserNotification[]>(null);
                    }
                })
            )
            .subscribe(
                notifications => {
                    if (notifications) {
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
                    } else {
                        this.notifications_.next([]);
                        this.socketService.unsyncUpdates(this.notificationSocketModel);
                    }
                },
                err => console.error(err)
            );
    }

    ngOnDestroy() {
        if (this.notificationSocketModel) {
            this.socketService.unsyncUpdates(this.notificationSocketModel);
        }
        if (this.notificationsSub) {
            this.notificationsSub.unsubscribe();
        }
    }

    notifications(): Observable<UserNotification[]> {
        return this.notifications_.asObservable();
    }
}
