
import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Notification, NotificationType } from './notification.model';

@Injectable()
export class NotificationService {
    public subject = new Subject<Notification>();
    public keepAfterRouteChange = true;

    static parameters = [Router];
    constructor(private router: Router) {
        // clear alert messages on route change unless 'keepAfterRouteChange' flag is true
        router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterRouteChange) {
                    this.keepAfterRouteChange = false;  // only keep for a single route change
                } else {
                    this.clear();  // clear alert messages
                }
            }
        });
    }

    getAlert(): Observable<Notification> {
        return this.subject.asObservable();
    }

    success(message: string, action = 'Close', keepAfterRouteChange = false) {
        this.showNotification(NotificationType.Success, message, action, keepAfterRouteChange);
    }

    error(message: string, action = 'Close', keepAfterRouteChange = false) {
        this.showNotification(NotificationType.Error, message, action, keepAfterRouteChange);
    }

    info(message: string, action = 'Close', keepAfterRouteChange = false) {
        this.showNotification(NotificationType.Info, message, action, keepAfterRouteChange);
    }

    warn(message: string, action = 'Close', keepAfterRouteChange = false) {
        this.showNotification(NotificationType.Warning, message, action, keepAfterRouteChange);
    }

    showNotification(type: NotificationType, message: string, action: string,
        keepAfterRouteChange = false) {
        this.keepAfterRouteChange = keepAfterRouteChange;
        this.subject.next(<Notification>{
            type: type,
            message: message,
            action: action
        });
    }

    clear() {
        this.subject.next();
    }
}
