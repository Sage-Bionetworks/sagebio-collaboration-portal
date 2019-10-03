import { Injectable, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserNotificationDataService } from 'components/user-notification/user-notification-data.service';

@Injectable()
export class PageTitleService implements OnDestroy {
    private title: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private subscription: Subscription;

    static parameters = [Title, UserNotificationDataService];
    constructor(private bodyTitle: Title, private userNotificationDataService: UserNotificationDataService) {
        combineLatest(
            this.title,
            this.userNotificationDataService.notifications().pipe(map(notifications => notifications.length))
        ).subscribe(
            ([title, numNotifications]) => {
                title = title !== '' ? `${title} | ` : '';
                let notification = numNotifications > 0 ? `(${numNotifications}) ` : '';
                this.bodyTitle.setTitle(`${notification}${title}PHC Collaboration Portal`);
            },
            err => console.error(err)
        );
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    setTitle(title: string): void {
        this.title.next(title);
    }
}
