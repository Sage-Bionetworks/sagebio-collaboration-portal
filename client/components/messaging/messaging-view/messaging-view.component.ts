import { Component, OnDestroy } from '@angular/core';
import { map } from 'rxjs/operators';
import { orderBy } from 'lodash/fp';
import { MessagingService } from '../../../components/messaging/messaging.service';
import { SocketService } from '../../../components/socket/socket.service';
import { Message } from '../../../../shared/interfaces/messaging/message.model';

@Component({
    selector: 'messaging-view',
    template: require('./messaging-view.html'),
    styles: [require('./messaging-view.scss')],
})
export class MessagingViewComponent implements OnDestroy {
    private messages: Message[];

    static parameters = [MessagingService, SocketService];
    constructor(private messagingService: MessagingService,
        private socketService: SocketService) {

        this.messagingService.getMessages()
            .pipe(
                map(messages => orderBy(['createdAt'], ['asc'], messages))
            )
            .subscribe(messages => {
                this.messages = messages;
                this.socketService.syncUpdates('message', this.messages);
            });
    }

    ngOnDestroy() {
        this.socketService.unsyncUpdates('message');
    }
}
