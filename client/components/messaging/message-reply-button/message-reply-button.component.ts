import { Component, OnInit, Input, Output, ComponentFactoryResolver, ViewEncapsulation, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { NotificationService } from '../../notification/notification.service';
import { SecondarySidenavService } from '../../sidenav/secondary-sidenav/secondary-sidenav.service';
import { Message } from '../../../../shared/interfaces/discussion/message.model';
import { MessagingService } from '../messaging.service';
import { MessagingDataService } from '../messaging-data.service';
import { ThreadSidenavComponent } from '../thread/thread-sidenav/thread-sidenav.component';
import { flow, orderBy, last, map as mapFp, takeRight, uniqBy } from 'lodash/fp';
import { LastUpdatedPipe } from '../../pipes/date/last-updated.pipe';
import { DateAndTimePipe } from '../../pipes/date/date-and-time.pipe';
import { UserProfile } from '../../../../shared/interfaces/user-profile.model';
import config from '../../../app/app.constants';

@Component({
    selector: 'message-reply-button',
    template: require('./message-reply-button.html'),
    styles: [require('./message-reply-button.scss')],
    encapsulation: ViewEncapsulation.None
})
export class MessageReplyButtonComponent implements OnInit {
    @Input() private message: Message;
    @Output() click: EventEmitter<any> = new EventEmitter<any>();

    private numReplies: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    private lastReplyAt: BehaviorSubject<string> = new BehaviorSubject<string>(undefined);
    private contributors: UserProfile[] = [];
    private avatarSize: number;
    private mouseOver = false;
    private maxNumContributorsInPreview = 5;

    static parameters = [MessagingService, MessagingDataService,
        NotificationService, SecondarySidenavService, ComponentFactoryResolver];
    constructor(private messagingService: MessagingService,
        private messagingDataService: MessagingDataService,
        private notificationService: NotificationService,
        private sidenavService: SecondarySidenavService,
        private componentFactoryResolver: ComponentFactoryResolver) {

        this.avatarSize = config.avatar.size.nano;
    }

    ngOnInit() {
        if (this.message) {
            this.messagingService.getReplies(this.message, { select: 'createdBy createdAt updatedAt' })
                .subscribe(replies => {
                    this.numReplies.next(replies.length);
                    this.contributors = flow([
                        orderBy(['createdAt'], ['desc']),
                        uniqBy('createdBy.username'),  // we have their most recent reply
                        orderBy(['createdAt'], ['asc']),
                        takeRight(this.maxNumContributorsInPreview),
                        mapFp((reply: Message) => reply.createdBy)
                    ])(replies);

                    let lastReplyAt = flow([
                        orderBy(['createddAt'], ['asc']),
                        last
                    ])(replies);
                    if (lastReplyAt) {
                        this.lastReplyAt.next(lastReplyAt.createdAt);
                    }
                }, err => {
                    console.log(err);
                });
        }
    }

    ngOnDestroy() { }

    /**
     * Returns the number of replies to the message.
     * @return {Observable<number>}
     */
    getNumReplies(): Observable<number> {
        return this.numReplies.asObservable();
    }
}
