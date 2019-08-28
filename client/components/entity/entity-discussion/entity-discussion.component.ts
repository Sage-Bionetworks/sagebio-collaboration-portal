import { Component, Input, AfterViewInit } from '@angular/core';
import { Entity } from 'models/entities/entity.model';
import { Thread } from 'models/messaging/thread.model';
import { MessagingService } from 'components/messaging/messaging.service';

@Component({
    selector: 'entity-discussion',
    template: require('./entity-discussion.html'),
    styles: [require('./entity-discussion.scss')],
})
export class EntityDiscussionComponent implements AfterViewInit {
    @Input() entity: Entity;
    @Input() entityType: string;

    private threads: Thread[];
    private allThreads: Thread[];

    static parameters = [MessagingService];
    constructor(private messagingService: MessagingService) { }

    ngAfterViewInit(): void {
        this.messagingService
            .getThreadsByEntity(this.entity._id)
            .subscribe(threads => {
                this.threads = threads;
                // this.socketService.syncUpdates('thread', this.threads);
            }, err => console.error(err));
    }
}
