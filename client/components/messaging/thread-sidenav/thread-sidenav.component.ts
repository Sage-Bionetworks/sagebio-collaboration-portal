import { Component, OnDestroy } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter, take, switchMap, tap } from 'rxjs/operators';
import { SecondarySidenavService } from '../../sidenav/secondary-sidenav/secondary-sidenav.service';
import { SocketService } from '../../socket/socket.service';
import { Thread } from 'models/messaging/thread.model';
import { Message } from 'models/messaging/message.model';
import { MessagingService } from '../messaging.service';
import { UserService } from 'components/auth/user.service';
import { UserPermissionDataService } from 'components/auth/user-permission-data.service';
import { User } from 'models/auth/user.model';
import { AuthService } from 'components/auth/auth.service';
import { orderBy } from 'lodash/fp';

@Component({
    selector: 'thread-sidenav',
    template: require('./thread-sidenav.html'),
    styles: [require('./thread-sidenav.scss')],
})
export class ThreadSidenavComponent implements OnDestroy {
    // private thread: Thread;
    private _thread: BehaviorSubject<Thread> = new BehaviorSubject<Thread>(undefined);
    private _messages: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([]);

    // private message: Message;
    // private messages: Message[];
    // private replies: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([]);
    private user: User;
    private editThread = false;

    private canCreateThread = false;
    private canDeleteThread = false;
    private canEditThread = false;

    private socketMessagesEventName: string;

    static parameters = [SecondarySidenavService, MessagingService, SocketService,
        UserService, UserPermissionDataService, Router, AuthService];
    constructor(
        private secondarySidenavService: SecondarySidenavService,
        private messagingService: MessagingService,
        private socketService: SocketService,
        private userService: UserService,
        private userPermissionDataService: UserPermissionDataService,
        private router: Router,
        private authService: AuthService
    ) {
        this._thread
            .pipe(
                filter(thread => !!thread),
                take(1),
                // TODO Emit socket event when Message is created or added
                tap(thread => this.socketMessagesEventName = `message:entity:${thread.entityId}:${thread._id}`),
                switchMap(thread => this.messagingService.getMessagesByThread(thread))
            )
            .subscribe(messages => {
                this._messages.next(messages);
                this.socketService.syncArraySubject(this.socketMessagesEventName,
                    this._messages, (items: Message[]) => {
                        return orderBy('createdAt', 'asc', items);
                    });
            }, err => console.error(err));

        this.router.events.pipe(
            filter(event => event instanceof NavigationStart)
        ).subscribe(_ => this.close());
    }

    ngOnDestroy() {
        if (this.socketMessagesEventName) this.socketService.unsyncUpdates(this.socketMessagesEventName);
    }

    setThread(thread: Thread): void {
        this._thread.next(thread);
    }

    updateThread(): void {
        // const updatedThread: Thread = this.thread;
        // updatedThread.updatedBy = this.user;

        // this.messagingService.updateThread(updatedThread).subscribe(thread => {
        //     this.thread = thread;
        //     this.refreshMessages();
        // });
    }

    onEditThread(thread): void {
        // this.thread = thread;
        // this.editThread = false;
        // this.refreshMessages();
    }

    onCancel(): void {
        this.editThread = false;
    }

    onEditMessage(): void {
        this.updateThread();
    }

    onDeleteMessage(): void {
        // this.refreshMessages();
    }

    onNewMessage(): void {
        // this.updateThread();
    }

    close(): void {
        this.secondarySidenavService.close();
        this.secondarySidenavService.destroyContentComponent();
    }

    editThreadTitle(): void {
        this.editThread = !this.editThread;
    }
}
