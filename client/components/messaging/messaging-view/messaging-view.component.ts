import config from '../../../app/app.constants'

import { Component, OnDestroy, Input, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { orderBy } from 'lodash/fp';

import { MessagingService } from 'components/messaging/messaging.service';
import { SocketService } from 'components/socket/socket.service';
import { ProjectDataService } from  '../../../app/project/project-data.service';
import { NotificationService } from 'components/notification/notification.service';

import { Message } from 'models/messaging/message.model';
import { Project } from 'models/project.model';
import { Thread } from 'models/messaging/thread.model';

@Component({
    selector: 'messaging-view',
    template: require('./messaging-view.html'),
    styles: [require('./messaging-view.scss')],
})
export class MessagingViewComponent implements OnDestroy, OnInit {
    private messages: Message[];
    private threads: Thread[]; // Added threads array to MessagingViewComponent

    @Input() entityId: string;
    @Input() entityType: string;

    static parameters = [MessagingService, SocketService, ProjectDataService, NotificationService];
    constructor(
        private messagingService: MessagingService,
        private socketService: SocketService,
        private projectDataService: ProjectDataService,
        private notificationService: NotificationService,
    ) { }

    ngOnInit() {
        // Load threads for a specific project
        if (this.entityId) {
            return this.loadThreadsForEntity(this.entityId, this.entityType);
        }
        // DEFAULT: Load threads
        return this.loadThreads()
    }

    loadThreads() {
        this.messagingService.getThreads()
            .pipe(
                map(threads => orderBy(['createdAt'], ['asc'], threads))
            )
            .subscribe(threads => {
                this.threads = threads;
                this.socketService.syncUpdates('thread', this.threads);
            });
    }

    loadThreadsForEntity(entityId, entityType) { // Default to project entity
        console.log(`Loading messages for
            entity type ${entityType}
            entity ID ${entityId}
        `);

        this.messagingService.getThreadsByEntity(entityId)
            .pipe(
                map(threads => orderBy(['createdAt'], ['asc'], threads))
            )
            .subscribe(threads => {
                this.threads = threads;
                this.socketService.syncUpdates('thread', this.threads);
            });
    }

    onNewThread(thread: Thread): void {
        this.loadThreads();
        this.notificationService.info('The Thread has been successfully created');
    }

    ngOnDestroy() {
        this.socketService.unsyncUpdates('thread');
    }
}
