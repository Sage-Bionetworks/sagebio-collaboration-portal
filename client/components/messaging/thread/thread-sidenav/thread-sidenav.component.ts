import { Component, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { orderBy } from 'lodash/fp';
import { SecondarySidenavService } from '../../../sidenav/secondary-sidenav/secondary-sidenav.service';
import { SocketService } from '../../../socket/socket.service';
import { Message } from '../../../../../shared/interfaces/messaging/message.model';
import { MessagingService } from '../../messaging.service';

@Component({
    selector: 'thread-sidenav',
    template: require('./thread-sidenav.html'),
    styles: [require('./thread-sidenav.scss')]
})
export class ThreadSidenavComponent implements OnDestroy {
    private message: Message;
    private replies: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([]);

    static parameters = [SecondarySidenavService, MessagingService, SocketService];
    constructor(private sidenavService: SecondarySidenavService,
        private messagingService: MessagingService,
        private socketService: SocketService) { }

    ngOnDestroy() {
        this.socketService.unsyncUpdates(`thread:${this.message._id}:message`);
    }

    setMessage(message: Message): void {
        if (message) {
            this.messagingService.getReplies(message)
                .pipe(
                    map(messages => orderBy(['createdAt'], ['asc'], messages))
                )
                .subscribe(replies => {
                    this.replies.next(replies);
                    this.socketService.syncArraySubject(`thread:${message._id}:message`, this.replies);
                    this.message = message;
                });
        }
    }

    close(): void {
        this.sidenavService.close();
        this.sidenavService.destroyContentComponent();
    }
}
