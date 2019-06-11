import { Component, OnInit } from '@angular/core';
import { Message } from '../../../../shared/interfaces/messaging/message.model';
import { StarredMessage } from '../../../../shared/interfaces/messaging/starred-message.model';
import { MessagingDataService } from '../messaging-data.service';
import { NotificationService } from '../../notification/notification.service';

@Component({
    selector: 'starred-message-list',
    template: require('./starred-message-list.html'),
    styles: [require('./starred-message-list.scss')],
})
export class StarredMessageListComponent implements OnInit {
    private stars: StarredMessage[] = [];
    private archivedStars: StarredMessage[] = [];

    static parameters = [MessagingDataService, NotificationService];
    constructor(private messagingDataService: MessagingDataService,
        private notificationService: NotificationService) {
        this.messagingDataService.getStarredMessages()
            .subscribe(messages => {
                this.stars = messages.filter(message => !message.archived);
                this.archivedStars = messages.filter(message => message.archived);
            });
    }

    ngOnInit() { }

    showArchived(): void {
        this.notificationService.info('Not implemented yet');
    }
}
