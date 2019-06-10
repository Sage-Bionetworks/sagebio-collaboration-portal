import { Component, OnInit, Input, ComponentFactoryResolver, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { NotificationService } from '../../notification/notification.service';
import { SidenavService } from '../../sidenav/sidenav.service';
import { Message } from '../../../../shared/interfaces/discussion/message.model';
import { MessagingService } from '../messaging.service';
import { MessagingDataService } from '../messaging-data.service';
import { SidenavItem } from '../../sidenav/sidenav-item';
import { MessageThreadComponent } from '../message-thread/message-thread.component';
import { flow, orderBy, last, map as mapFp, takeRight } from 'lodash/fp';
import { LastUpdatedPipe } from '../../pipes/date/last-updated.pipe';
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
    private numReplies: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    private lastReplyAt: BehaviorSubject<string> = new BehaviorSubject<string>(undefined);
    private contributors: UserProfile[] = [];
    private avatarSize: number;
    private mouseOver = false;
    private maxNumContributorsInPreview = 10;

    static parameters = [MessagingService, MessagingDataService,
        NotificationService, SidenavService, ComponentFactoryResolver];
    constructor(private messagingService: MessagingService,
        private messagingDataService: MessagingDataService,
        private notificationService: NotificationService,
        private sidenavService: SidenavService,
        private componentFactoryResolver: ComponentFactoryResolver) {

        this.avatarSize = config.avatar.size.nano;
    }

    ngOnInit() {
        if (this.message) {
            this.messagingService.getNumReplies(this.message)
                .subscribe(numReplies => this.numReplies.next(numReplies),
                    err => {
                        console.log(err);
                    });

            this.messagingService.getReplies(this.message, { select: 'createdBy createdAt updatedAt' })
                .subscribe(replies => {
                    this.contributors = flow([
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

    showReplies(): void {
        // let sidenavContent = new SidenavItem(MessageThreadComponent, { title: 'YOOO' });
        // this.sidenavService.show(sidenavContent);
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(MessageThreadComponent);
        let viewContainerRef = this.sidenavService.getSecondarySidenavHost().viewContainerRef;
        viewContainerRef.clear();
        let componentRef = viewContainerRef.createComponent(componentFactory);
        componentRef.instance.setMessage(this.message);
        this.sidenavService.open();
    }

    /**
     * Returns the number of replies to the message.
     * @return {Observable<number>}
     */
    getNumReplies(): Observable<number> {
        return this.numReplies.asObservable();
    }
}
