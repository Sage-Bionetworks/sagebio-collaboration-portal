import { Component, OnInit, AfterViewInit, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, filter, startWith, delay } from 'rxjs/operators';

import { Thread } from 'models/messaging/thread.model';
import { Message } from 'models/messaging/message.model';
import { NotificationService } from 'components/notification/notification.service';
import { MessageStarButtonComponent } from '../message-star-button/message-star-button.component';
import { MessageReplyButtonComponent } from '../message-reply-button/message-reply-button.component';
import { MessagingService } from '../messaging.service';
import { MessagingDataService } from '../messaging-data.service';
import config from '../../../app/app.constants';
import { DateAndTimePipe } from '../../pipes/date/date-and-time.pipe';
import { AppQuillEditorComponent } from 'components/quill/app-quill-editor/app-quill-editor.component';

const MESSAGE_EDITED_DELTA_T = 1000;  // 1 second

@Component({
    selector: 'thread-preview',
    template: require('./thread-preview.html'),
    styles: [require('./thread-preview.scss')],
    encapsulation: ViewEncapsulation.None
})

export class ThreadPreviewComponent implements OnInit, AfterViewInit {
    @Input() private showReplyButton = true;
    @Input() private showStartThreadButton = true;

    private _thread: BehaviorSubject<Thread> = new BehaviorSubject<Thread>(undefined);
    private tooltipPosition = 'above';
    @ViewChild(MessageStarButtonComponent, { static: false }) starButton: MessageStarButtonComponent;
    @ViewChild(MessageReplyButtonComponent, { static: false }) replyButton: MessageReplyButtonComponent;

    private starred: Observable<boolean>;
    private numReplies: Observable<number>;

    private form: FormGroup;
    private edited = false;
    private threadSub: Subscription;
    private getThreadSub: Subscription;
    private tooltipShowDelay: number;
    private avatarSize = 40;

    static parameters = [FormBuilder, NotificationService, MessagingService,
        MessagingDataService];
    constructor(private formBuilder: FormBuilder,
        private notificationService: NotificationService,
        private messagingService: MessagingService,
        private messagingDataService: MessagingDataService) {

        this.form = formBuilder.group({
            _id: [''],
        });

        this.threadSub = this._thread
            .subscribe(thread => {
                if (thread) {
                    this.form.get('_id').setValue(thread._id);
                    let createdAt = new Date(thread.createdAt);
                    let updatedAt = new Date(thread.updatedAt);
                    this.edited = (updatedAt.getTime() - createdAt.getTime()) > MESSAGE_EDITED_DELTA_T;
                }
            });

        this.tooltipShowDelay = config.tooltip.showDelay;
        this.avatarSize = config.avatar.size.mini;
    }

    ngOnInit() { }

    ngAfterViewInit() { }

    ngOnDestroy() {
        if (this.threadSub) this.threadSub.unsubscribe();
        if (this.getThreadSub) this.getThreadSub.unsubscribe();
    }

    get thread() {
        return this._thread.getValue();
    }

    @Input()
    set thread(thread) {
        this._thread.next(thread);
    }

    @Input()
    set threadId(threadId) {
        if (!this.getThreadSub) {
            this.getThreadSub.unsubscribe();
        }
    }

    showThread(): void {
        this.messagingService.showThread(this.thread);
    }

}
