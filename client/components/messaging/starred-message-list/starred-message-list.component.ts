import { Component, OnInit } from '@angular/core';
import { Message } from '../../../../shared/interfaces/messaging/message.model';
import { StarredMessage } from '../../../../shared/interfaces/messaging/starred-message.model';
import { MessagingDataService } from '../messaging-data.service';

@Component({
    selector: 'starred-message-list',
    template: require('./starred-message-list.html'),
    styles: [require('./starred-message-list.scss')],
})
export class StarredMessageListComponent implements OnInit {
    private stars: StarredMessage[] = [];
    private archivedStars: StarredMessage[] = [];

    static parameters = [MessagingDataService];
    constructor(private messagingDataService: MessagingDataService) {
        this.messagingDataService.getStarredMessages()
            .subscribe(messages => {
                this.stars = messages.filter(message => !message.archived);
                this.archivedStars = messages.filter(message => message.archived);
            });
    }

    ngOnInit() { }
}
