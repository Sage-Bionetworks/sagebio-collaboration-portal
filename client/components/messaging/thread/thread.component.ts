import { Component, OnInit, Input, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, BehaviorSubject, forkJoin, of } from 'rxjs';
import { switchMap, catchError, map, take } from 'rxjs/operators';
import { Message } from 'models/messaging/message.model';
import { Thread } from 'models/messaging/thread.model';
import { NotificationService } from 'components/notification/notification.service';
import { MessagingService } from '../messaging.service';
import { SocketService } from 'components/socket/socket.service';
import { orderBy } from 'lodash/fp';
import { AuthService } from 'components/auth/auth.service';

@Component({
    selector: 'thread',
    template: require('./thread.html'),
    styles: [require('./thread.scss')],
})
export class ThreadComponent implements OnInit, OnDestroy {
    @Input() threadId: string;
    @Input() private canEdit = false;
    @Input() private canDelete = false;
    @Output() deleted: EventEmitter<Thread> = new EventEmitter<Thread>();

    private showThreadEditTemplate = false; // used in html

    private thread: BehaviorSubject<Thread> = new BehaviorSubject<Thread>(null);
    private messages: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([]);

    private threadSocketModel: string;
    private messagesSocketModel: string;

    static parameters = [Router, ActivatedRoute, SocketService, NotificationService, MessagingService, AuthService];
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private socketService: SocketService,
        private notificationService: NotificationService,
        private messagingService: MessagingService,
        private authService: AuthService
    ) {}

    get thread$(): Observable<Thread> {
        return this.thread.asObservable();
    }

    get messages$(): Observable<Message[]> {
        return this.messages.asObservable();
    }

    ngOnInit() {
        if (this.threadId) {
            this.messagingService
                .getThread(this.threadId)
                .pipe(
                    switchMap(thread =>
                        forkJoin({
                            thread: of(thread),
                            messages: this.messagingService.getMessages(thread).pipe(
                                catchError(err => {
                                    console.error(err);
                                    this.notificationService.error('Unable to get messages');
                                    return of<Message[]>([]);
                                })
                            ),
                        })
                    )
                )
                .subscribe(res => {
                    this.thread.next(res.thread);
                    this.messages.next(res.messages);

                    this.threadSocketModel = `thread:${res.thread._id}`;
                    this.socketService.syncItemSubject(this.threadSocketModel, this.thread);

                    this.messagesSocketModel = `thread:${res.thread._id}:messages`;
                    this.socketService.syncArraySubject(
                        this.messagesSocketModel,
                        this.messages,
                        (messages: Message[]) => {
                            return orderBy('createdAt', 'asc', messages);
                        }
                    );
                });
        }
    }

    ngOnDestroy() {
        this.socketService.unsyncUpdates(this.threadSocketModel);
        this.socketService.unsyncUpdates(this.messagesSocketModel);
    }

    getLink(): string {
        return window.location.href;
    }

    deleteThread(thread: Thread): void {
        console.log('Deleting thread');
        this.messagingService.removeThread(thread).subscribe(
            () => {
                console.log('thread deleted');
                this.deleted.emit(thread);
            },
            err => {
                console.error('Unable to remove the thread', err);
                this.notificationService.error('Unable to remove the thread');
            }
        );
    }

    onThreadEdit(thread: Thread): void {
        if (thread) {
            this.thread.next(thread);
            this.showThreadEditTemplate = false;
        }
    }

    onNewMessage(message: Message): void {
        console.log('THREAD: NEW MESSAGE');
    }

    canEditMessage(message: Message): Observable<boolean> {
        const isMessageAuthor$ = this.authService.authInfo().pipe(
            take(1),
            map(authInfo => {
                return authInfo.user._id.toString() === message.createdBy._id.toString();
            })
        );

        return forkJoin({
            isMessageAuthor: isMessageAuthor$,
            canEditThread: of(this.canEdit),
        }).pipe(
            map(res => {
                return res.isMessageAuthor;
            })
        );
    }

    canDeleteMessage(message: Message): Observable<boolean> {
        return this.canEditMessage(message);
    }
}
