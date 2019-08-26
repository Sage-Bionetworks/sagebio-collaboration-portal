import config from '../../../app/app.constants';

import { Component, OnDestroy, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { orderBy } from 'lodash/fp';

import { Thread } from 'models/messaging/thread.model';
import { MessagingService } from 'components/messaging/messaging.service';
import { SocketService } from 'components/socket/socket.service';

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
    private showNewThreadForm = false;

    static parameters = [
        MessagingService,
        SocketService
    ];
    constructor(
        private messagingService: MessagingService,
        private socketService: SocketService,
    ) {}

    ngOnInit() {
        if (this.entityId) {
            this.socketEventName = `thread:entity:${this.entityId}`;
            this.messagingService.getThreadsByEntity(this.entityId)
                .subscribe(threads => {
                    this._threads.next(threads);
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

    startNewDiscussion(): void {
        this.showNewThreadForm = !this.showNewThreadForm;

        // // Display the start discussion form in the sidebar
        // this.secondarySidenavService.loadContentComponent(ThreadNewComponent);
        // this.secondarySidenavService.open();
    }

    onNewThread(thread: Thread): void {
        this.showNewThreadForm = false;
    }
}
