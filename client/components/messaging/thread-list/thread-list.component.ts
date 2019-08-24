import config from '../../../app/app.constants';

import { Component, OnDestroy, Input, OnInit, AfterViewInit } from '@angular/core';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { orderBy } from 'lodash/fp';

import { MessagingService } from 'components/messaging/messaging.service';
import { SocketService } from 'components/socket/socket.service';
import { ProjectDataService } from '../../../app/project/project-data.service';
import { NotificationService } from 'components/notification/notification.service';
import { SecondarySidenavService } from '../../../components/sidenav/secondary-sidenav/secondary-sidenav.service';

import { Message } from 'models/messaging/message.model';
import { Project } from 'models/entities/project.model';
import { Thread } from 'models/messaging/thread.model';
import { ThreadNewComponent } from '../thread-new/thread-new.component';

@Component({
    selector: 'thread-list',
    template: require('./thread-list.html'),
    styles: [require('./thread-list.scss')],
})
export class ThreadListComponent implements OnInit, OnDestroy {
    @Input() entityId: string;
    @Input() entityType: string;

    private _threads: BehaviorSubject<Thread[]> = new BehaviorSubject<Thread[]>([]);
    private socketEventName: string;

    // private messages: Message[];
    // private threads: Thread[]; // Added threads array to ThreadListComponent
    private showNewThreadForm = false;

    static parameters = [
        MessagingService,
        SocketService,
        // ProjectDataService,
        // NotificationService,
        // SecondarySidenavService,
    ];
    constructor(
        private messagingService: MessagingService,
        private socketService: SocketService,
        // private projectDataService: ProjectDataService,
        // private notificationService: NotificationService,
        // private secondarySidenavService: SecondarySidenavService
    ) {}

    // ngOnInit() {
    //     // // Load threads for a specific project
    //     // if (this.entityId) {
    //     //     return this.loadThreadsForEntity(this.entityId, this.entityType);
    //     // }
    //     // // DEFAULT: Load threads
    //     // return this.loadThreads();
    // }

    ngOnInit() {
        if (this.entityId) {
            this.socketEventName = `thread:entity:${this.entityId}`;
            this.messagingService.getThreadsByEntity(this.entityId)
                .subscribe(threads => {
                    this._threads.next(threads);
                    // TODO unsync
                    this.socketService.syncArraySubject(this.socketEventName,
                    this._threads, (items: Thread[]) => {
                        return orderBy('createdAt', 'desc', items);
                    });
                }, err => console.error(err));
        }
    }

    ngOnDestroy() {
        if (this.socketEventName) this.socketService.unsyncUpdates(this.socketEventName);
    }

    // loadThreads() {
    //     this.messagingService
    //         .getThreads()
    //         .subscribe(threads => {
    //             this.threads = threads;
    //             this.socketService.syncUpdates('thread', this.threads);
    //         });
    // }

    // loadThreadsForEntity(entityId, entityType) {
    //     // Default to project entity
    //     this.messagingService
    //         .getThreadsByEntity(entityId)
    //         .subscribe(threads => {
    //             this.threads = threads;
    //             this.socketService.syncUpdates('thread', this.threads);
    //         });
    // }

    // refreshThreadList() {
    //     if (this.entityId) {
    //         this.loadThreadsForEntity(this.entityId, this.entityType);
    //     } else {
    //         this.loadThreads();
    //     }
    // }

    // onDeleteThread(): void {
    //     this.refreshThreadList();
    // }

    onNewThread(thread: Thread): void {
        this.showNewThreadForm = false;
        // this.refreshThreadList();
        // this.notificationService.info('The thread has been successfully created');
    }

    startNewDiscussion(): void {
        // Dynamically show/hide the form in our main view
        this.showNewThreadForm = !this.showNewThreadForm;

        // // Display the start discussion form in the sidebar
        // this.secondarySidenavService.loadContentComponent(ThreadNewComponent);
        // this.secondarySidenavService.open();
    }
}
