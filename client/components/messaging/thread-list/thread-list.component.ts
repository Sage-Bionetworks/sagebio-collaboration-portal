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
    selector: 'thread-list',
    template: require('./thread-list.html'),
    styles: [require('./thread-list.scss')],
})
export class ThreadListComponent implements OnDestroy, OnInit {
    private messages: Message[];
    private threads: Thread[]; // Added threads array to ThreadListComponent

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
                map(threads => orderBy(['createdAt'], ['desc'], threads))
            )
            .subscribe(threads => {
                this.threads = threads;
                this.socketService.syncUpdates('thread', this.threads);
            });
    }

    loadThreadsForEntity(entityId, entityType) { // Default to project entity
        this.messagingService.getThreadsByEntity(entityId)
            .pipe(
                map(threads => orderBy(['createdAt'], ['desc'], threads))
            )
            .subscribe(threads => {
                this.threads = threads;
                this.socketService.syncUpdates('thread', this.threads);
            });
    }

    onNewThread(thread: Thread): void {
        if (this.entityId) {
            this.loadThreadsForEntity(this.entityId, this.entityType);
        } else {
            this.loadThreads();
        }
        // this.notificationService.info('The Thread has been successfully created');
    }

    onStartADiscussion(): void {
        this.messagingService.showNewThread();
    }

    ngOnDestroy() {
        this.socketService.unsyncUpdates('thread');
    }
}
