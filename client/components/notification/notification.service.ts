
import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Notification, NotificationType } from './notification.model';

@Injectable()
export class NotificationService {
    public subject = new Subject<Notification>();
    public keepAfterRouteChange = true;

    constructor(public router: Router) {
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

    success(message: string, keepAfterRouteChange = false) {
        this.showNotification(NotificationType.Success, message, keepAfterRouteChange);
    }

    error(message: string, keepAfterRouteChange = false) {
        this.showNotification(NotificationType.Error, message, keepAfterRouteChange);
    }

    info(message: string, keepAfterRouteChange = false) {
        this.showNotification(NotificationType.Info, message, keepAfterRouteChange);
    }

    warn(message: string, keepAfterRouteChange = false) {
        this.showNotification(NotificationType.Warning, message, keepAfterRouteChange);
    }

    showNotification(type: NotificationType, message: string, keepAfterRouteChange = false) {
        this.keepAfterRouteChange = keepAfterRouteChange;
        this.subject.next(<Notification>{ type: type, message: message });
    }

    clear() {
        this.subject.next();
    }
}
