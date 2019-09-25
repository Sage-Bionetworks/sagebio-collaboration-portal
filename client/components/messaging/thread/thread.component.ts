import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { App } from 'models/entities/app.model';
import { Thread } from 'models/messaging/thread.model';
// import { AppService } from './../../app.service';
// import config from '../../app.constants';
import { switchMap, filter, take, tap } from 'rxjs/operators';
import { NotificationService } from 'components/notification/notification.service';
import { MessagingService } from '../messaging.service';
import { Message } from 'models/messaging/message.model';

@Component({
    selector: 'thread',
    template: require('./thread.html'),
    styles: [require('./thread.scss')],
})
export class ThreadComponent implements OnInit {
    private _thread: BehaviorSubject<Thread> = new BehaviorSubject<Thread>(null);
    private messages: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([]);

    // @Input() private thread$: Observable<Thread>;
    private showThreadEditTemplate = false;

    static parameters = [Router, ActivatedRoute, NotificationService, MessagingService];
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private notificationService: NotificationService,
        private messagingService: MessagingService
    ) {
        // this.thread$ = this.route.params.pipe(
        //     switchMap(res => this.dataCatalogService.get(res.id))
        // );
    }

    get thread$(): Observable<Thread> {
        return this._thread.asObservable();
    }

    @Input()
    set thread(thread) {
        this._thread.next(thread);
    }

    get messages$(): Observable<Message[]> {
        return this.messages.asObservable();
    }

    ngOnInit() {
        this._thread
            .pipe(
                filter(thread => !!thread),
                take(1),
                // TODO Emit socket event when Message is created or added
                // tap(thread => this.socketMessagesEventName = `message:entity:${thread.entityId}:${thread._id}`),
                switchMap(thread => this.messagingService.getMessages(thread))
            )
            .subscribe(
                messages => {
                    this.messages.next(messages);
                    // this.socketService.syncArraySubject(this.socketMessagesEventName,
                    //     this._messages, (items: Message[]) => {
                    //         return orderBy('createdAt', 'asc', items);
                    //     });
                },
                err => console.error(err)
            );
    }

    getLink(): string {
        return window.location.href;
    }

    onThreadEdit(thread: Thread): void {
        if (thread) {
            this._thread.next(thread);
            this.showThreadEditTemplate = false;
        }
    }
}
