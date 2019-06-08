import { Component, OnInit, Input, ComponentFactoryResolver } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { NotificationService } from '../../notification/notification.service';
import { SidenavService } from '../../sidenav/sidenav.service';
import { Message } from '../../../../shared/interfaces/discussion/message.model';
import { MessagingService } from '../messaging.service';
import { MessagingDataService } from '../messaging-data.service';
import { SidenavItem } from '../../sidenav/sidenav-item';
import { MessageThreadComponent } from '../message-thread/message-thread.component';
import { flow, orderBy, last } from 'lodash/fp';
import { LastUpdatedPipe } from '../../pipes/date/last-updated.pipe';

@Component({
    selector: 'message-reply-button',
    template: require('./message-reply-button.html'),
    styles: [require('./message-reply-button.scss')]
})
export class MessageReplyButtonComponent implements OnInit {
    @Input() private message: Message;
    private numReplies: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    private updatedAt: BehaviorSubject<string> = new BehaviorSubject<string>(undefined);

    static parameters = [MessagingService, MessagingDataService,
        NotificationService, SidenavService, ComponentFactoryResolver];
    constructor(private messagingService: MessagingService,
        private messagingDataService: MessagingDataService,
        private notificationService: NotificationService,
        private sidenavService: SidenavService,
        private componentFactoryResolver: ComponentFactoryResolver) {
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
                    let lastUpdated = flow([
                        orderBy(['updatedAt'], ['asc']),
                        last
                    ])(replies);
                    if (lastUpdated) {
                        this.updatedAt.next(lastUpdated.updatedAt);
                    }



                    console.log('LAST updated', lastUpdated);

                    console.log('REPLIES', replies);
                },
                    err => {
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
