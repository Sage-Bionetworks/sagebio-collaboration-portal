import { Component, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { orderBy } from 'lodash/fp';
import { SecondarySidenavService } from '../../sidenav/secondary-sidenav/secondary-sidenav.service';
import { SocketService } from '../../socket/socket.service';
import { Thread } from 'models/messaging/thread.model';
import { Message } from 'models/messaging/message.model';
import { MessagingService } from '../messaging.service';

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

    static parameters = [SecondarySidenavService, MessagingService, SocketService];
    constructor(private sidenavService: SecondarySidenavService,
        private messagingService: MessagingService,
        private socketService: SocketService) { }

    ngOnDestroy() {
        // this.socketService.unsyncUpdates(`thread:${this.message._id}:message`);
    }

    setThread(thread: Thread): void {
        this.thread = thread;
        this.messagingService.getMessagesForThread(this.thread._id).subscribe(messages => {
            this.messages = messages;
            this.message = messages[0];
        });
    }

    onNewMessage(): void {
        this.messagingService.getMessagesForThread(this.thread._id).subscribe(messages => {
            this.messages = messages;
            this.message = messages[0];
        });
    }

    close(): void {
        this.sidenavService.close();
        this.sidenavService.destroyContentComponent();
    }
}
