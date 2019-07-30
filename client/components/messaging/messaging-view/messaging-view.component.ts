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
    private messages: Message[];

    @Input() entityId: string;
    @Input() entityType: string;

    static parameters = [MessagingService, SocketService, ProjectDataService];
    constructor(
        private messagingService: MessagingService,
        private socketService: SocketService,
        private projectDataService: ProjectDataService,
    ) { }

    ngOnInit() {
        // Load messages for a specific project
        if (this.entityId) {
            return this.loadMessagesForEntity(this.entityId, this.entityType);
        }
        // DEFAULT: Load messages
        return this.loadMessages()
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

    loadMessagesForEntity(entityId, entityType) { // Default to project entity
        // WIP #49 - Need to load messages from messaging service
        console.log(`[NOT YET IMPLEMENTED] Loading messages for
            entity type ${entityType}
            entity ID ${entityId}
        `);
    }

    ngOnDestroy() {
        this.socketService.unsyncUpdates('message');
    }
}
