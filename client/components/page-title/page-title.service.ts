import { Injectable, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';

@Injectable()
export class PageTitleService implements OnDestroy {
    private title: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private numNotifications: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    private subscription: Subscription;

    static parameters = [Title];
    constructor(private bodyTitle: Title) {
        combineLatest(this.title, this.numNotifications).subscribe(
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

    setNumNotifications(numNotifications: number): void {
        this.numNotifications.next(numNotifications);
    }
}
