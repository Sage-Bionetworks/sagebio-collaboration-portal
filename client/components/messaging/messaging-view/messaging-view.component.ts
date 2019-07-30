import config from '../../../app/app.constants'

import { Component, OnDestroy, Input, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { orderBy } from 'lodash/fp';

import { MessagingService } from 'components/messaging/messaging.service';
import { SocketService } from 'components/socket/socket.service';
import { ProjectDataService } from  '../../../app/project/project-data.service';

import { Message } from 'models/messaging/message.model';
import { Project } from 'models/project.model';

@Component({
    selector: 'messaging-view',
    template: require('./messaging-view.html'),
    styles: [require('./messaging-view.scss')],
})
export class MessagingViewComponent implements OnDestroy, OnInit {
    private entityId: string;
    private messages: Message[];

    @Input() entityType: string;

    static parameters = [MessagingService, SocketService, ProjectDataService];
    constructor(
        private messagingService: MessagingService,
        private socketService: SocketService,
        private projectDataService: ProjectDataService,
    ) { }

    ngOnInit() {
        console.log(`MessagingView component ngOnInit
            this.entityType: ${this.entityType}
        `)

        switch (true) {
            case (this.entityType === config.entityTypes.PROJECT.value):
                this.projectDataService.project().subscribe(project => {
                    try {
                        this.entityId = project._id
                    } catch (err) {
                        // If we do not have an ID to work with, it's fine to leave this as undefined
                        return this.loadMessages();
                    }
                });
                this.loadMessagesForEntity(this.entityId);
                break;
            default:
                this.loadMessages();
        }
    }

    loadMessages() {
        console.log(`[DEFAULT] Loading messages`)
        this.messagingService.getMessages()
            .pipe(
                map(messages => orderBy(['createdAt'], ['asc'], messages))
            )
            .subscribe(messages => {
                this.messages = messages;
                this.socketService.syncUpdates('message', this.messages);
            });
    }

    loadMessagesForEntity(entityId) {
        console.log(`[NOT YET IMPLEMENTED] Loading messages for entity ID ${entityId}`);
    }

    ngOnDestroy() {
        this.socketService.unsyncUpdates('message');
    }
}
