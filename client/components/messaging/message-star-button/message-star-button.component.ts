import { Component, OnInit, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription, combineLatest } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { QuillEditorComponent } from 'ngx-quill';

import { NotificationService } from '../../../components/notification/notification.service';
import { Message } from '../../../../shared/interfaces/discussion/message.model';
import { MessagingService } from '../messaging.service';
import { MessagingDataService } from '../messaging-data.service';
import { AppQuillEditorToolbarComponent } from '../../quill/app-quill-editor-toolbar/app-quill-editor-toolbar.component';
import { models } from '../../../app/app.constants';

@Component({
    selector: 'message-star-button',
    template: require('./message-star-button.html'),
    styles: [require('./message-star-button.scss')]
})
export class MessageStarButtonComponent implements OnInit {
    @Input() private message: Message;
    private starred = false;
    private starredSub: Subscription;
    private numStars = 0;
    private tooltipPosition = 'above';
    // private _message: BehaviorSubject<Message> = new BehaviorSubject<Message>(undefined);
    // private starred = false;
    // private numStars = 0;
    // private tooltipPosition = 'above';
    // @ViewChild('editor') editor: QuillEditorComponent;
    // private hide = false;
    // private form: FormGroup;
    // private isReadOnly = true;
    // private edited = false;
    // private messageSub: Subscription;
    // private getMessageSub: Subscription;
    // private starredSub: Subscription;

    static parameters = [MessagingService, MessagingDataService,
        NotificationService];
    constructor(private messagingService: MessagingService,
        private messagingDataService: MessagingDataService,
        private notificationService: NotificationService) {
    }

    ngOnInit() {
        this.starredSub = this.messagingDataService.getStarredMessages()
            .pipe(
                map(stars => stars.map(star => star.message).includes(this.message._id))
            )
            .subscribe(starred => {
                this.starred = starred;
                this.messagingService.getNumStars(this.message)
                    .subscribe(numStars => this.numStars = numStars);
            });
    }

    ngOnDestroy() {
        if (this.starredSub) this.starredSub.unsubscribe();
    }

    starMessage(): void {
        this.messagingService.starMessage(this.message)
            .subscribe(() => { },
                err => {
                    console.log(err);
                    this.notificationService.error('Unable to star message');
                });
    }

    unstarMessage(): void {
        this.messagingService.unstarMessage(this.message)
            .subscribe(() => { },
                err => {
                    console.log(err);
                    this.notificationService.error('Unable to unstar message');
                });
    }
}
