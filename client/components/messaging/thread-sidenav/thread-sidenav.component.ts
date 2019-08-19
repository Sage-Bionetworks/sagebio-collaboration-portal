import { Component, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { orderBy } from 'lodash/fp';
import { SecondarySidenavService } from '../../sidenav/secondary-sidenav/secondary-sidenav.service';
import { SocketService } from '../../socket/socket.service';
import { Thread } from 'models/messaging/thread.model';
import { Message } from 'models/messaging/message.model';
import { MessagingService } from '../messaging.service';
import { UserService } from 'components/auth/user.service';
import { User } from 'models/auth/user.model';

@Component({
    selector: 'thread-sidenav',
    template: require('./thread-sidenav.html'),
    styles: [require('./thread-sidenav.scss')]
})
export class ThreadSidenavComponent implements OnDestroy {
    private thread: Thread;
    private message: Message;
    private messages: Message[];
    private replies: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([]);
    private user: User;

    static parameters = [SecondarySidenavService, MessagingService, SocketService, UserService];
    constructor(private secondarySidenavService: SecondarySidenavService,
        private messagingService: MessagingService,
        private socketService: SocketService,
        private userService: UserService,
        ) {
            // Get the current user ID
            this.userService.get()
                .subscribe(user => {
                    this.user = user;
                });
        }

    ngOnDestroy() { }

    refreshMessages(): void {
        this.messagingService.getMessagesForThread(this.thread._id).subscribe(messages => {
            this.messages = messages;
            this.message = messages[0];
        });
    }

    setThread(thread: Thread): void {
        this.thread = thread;
        this.refreshMessages();
    }

    updateThread(): void {
        const updatedThread: Thread = this.thread;
        updatedThread.updatedBy = this.user;
        updatedThread.updatedAt = Date.now().toString();

        this.messagingService.updateThread(updatedThread).subscribe(thread => {
            this.thread = thread;
            this.refreshMessages();
        })

    }

    onEditMessage(): void {
        this.updateThread();
        this.refreshMessages();
    }

    onDeleteMessage(): void {
        this.refreshMessages();
    }

    onNewMessage(): void {
        this.updateThread();
        this.refreshMessages();
    }

    close(): void {
        this.secondarySidenavService.close();
        this.secondarySidenavService.destroyContentComponent();
    }
}
