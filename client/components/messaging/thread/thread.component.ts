import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, BehaviorSubject, forkJoin, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { Message } from 'models/messaging/message.model';
import { Thread } from 'models/messaging/thread.model';
import { NotificationService } from 'components/notification/notification.service';
import { MessagingService } from '../messaging.service';

@Component({
    selector: 'thread',
    template: require('./thread.html'),
    styles: [require('./thread.scss')],
})
export class ThreadComponent implements OnInit {
    @Input() threadId: string;
    private showThreadEditTemplate = false; // used in html

    private thread: BehaviorSubject<Thread> = new BehaviorSubject<Thread>(null);
    private messages: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([]);

    static parameters = [Router, ActivatedRoute, NotificationService, MessagingService];
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private notificationService: NotificationService,
        private messagingService: MessagingService
    ) {

    }

    get thread$(): Observable<Thread> {
        return this.thread.asObservable();
    }

    get messages$(): Observable<Message[]> {
        return this.messages.asObservable();
    }

    ngOnInit() {
        if (this.threadId) {
            this.route.params
                .pipe(
                    switchMap(res => this.messagingService.getThread(res.id)),
                    switchMap(thread => forkJoin({
                        thread: of(thread),
                        messages: this.messagingService.getMessages(thread)
                            .pipe(
                                catchError(err => {
                                    console.error(err);
                                    this.notificationService.error('Unable to get messages');
                                    return of<Message[]>([]);
                                })
                            )
                    }))
                )
                .subscribe(res => {
                    this.thread.next(res.thread);
                    this.messages.next(res.messages);
                });
        }
    }

    getLink(): string {
        return window.location.href;
    }

    deleteThread(thread: Thread): void {
        this.notificationService.info('Not implemented');
    }

    onThreadEdit(thread: Thread): void {
        if (thread) {
            this.thread.next(thread);
            this.showThreadEditTemplate = false;
        }
    }
}
