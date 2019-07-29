import { Component, OnDestroy, Input } from '@angular/core';
import { map } from 'rxjs/operators';
import { orderBy } from 'lodash/fp';
import { MessagingService } from 'components/messaging/messaging.service';
import { SocketService } from 'components/socket/socket.service';
import { Message } from 'models/messaging/message.model';
import { Project } from 'models/project.model';

@Component({
    selector: 'messaging-view',
    template: require('./messaging-view.html'),
    styles: [require('./messaging-view.scss')],
})
export class MessagingViewComponent implements OnDestroy {
    private messages: Message[];
    private project: Project;

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

    @Input()
    set entity(project) {
        this.project = project;
    }
    get entity() {
        return this.project;
    }

    ngOnDestroy() {
        this.socketService.unsyncUpdates('message');
    }
}
