import { Component, OnDestroy, OnInit, AfterViewInit, Input, ViewChild, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, BehaviorSubject, Subscription, combineLatest } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, filter, startWith, delay } from 'rxjs/operators';

import { Thread } from 'models/messaging/thread.model';
import { Message } from 'models/messaging/message.model';
import { NotificationService } from 'components/notification/notification.service';
import { UserPermissionDataService } from 'components/auth/user-permission-data.service';
import { MessageStarButtonComponent } from '../message-star-button/message-star-button.component';
import { MessageReplyButtonComponent } from '../message-reply-button/message-reply-button.component';
import { MessagingService } from '../messaging.service';
import { MessagingDataService } from '../messaging-data.service';
import config from '../../../app/app.constants';
import { DateAndTimePipe } from '../../pipes/date/date-and-time.pipe';
import { AppQuillEditorComponent } from 'components/quill/app-quill-editor/app-quill-editor.component';
import { AuthService } from 'components/auth/auth.service';

@Component({
    selector: 'thread-preview',
    template: require('./thread-preview.html'),
    styles: [require('./thread-preview.scss')],
    encapsulation: ViewEncapsulation.None
})

export class ThreadPreviewComponent implements OnDestroy {
    @Output() deleteThread: EventEmitter<Thread> = new EventEmitter<Thread>();
    // @ViewChild(MessageStarButtonComponent, { static: false }) starButton: MessageStarButtonComponent;
    // @ViewChild(MessageReplyButtonComponent, { static: false }) replyButton: MessageReplyButtonComponent;

    private _thread: BehaviorSubject<Thread> = new BehaviorSubject<Thread>(undefined);
    private tooltipPosition = 'above';
    private tooltipShowDelay: number;
    private avatarSize: number;

    // private initialMessage: Message;
    // private starred: Observable<boolean>;
    private numReplies: number;

    private threadSub: Subscription;

    private canCreateThread = false;
    private canDeleteThread = false;
    private canEditThread = false;

    // TODO add thread title max length to 64

    static parameters = [FormBuilder, NotificationService, MessagingService, MessagingDataService, UserPermissionDataService, AuthService];
    constructor(private formBuilder: FormBuilder,
        private notificationService: NotificationService,
        private messagingService: MessagingService,
        private messagingDataService: MessagingDataService,
        private userPermissionDataService: UserPermissionDataService,
        private authService: AuthService
        ) {

        this.tooltipShowDelay = config.tooltip.showDelay;
        this.avatarSize = config.avatar.size.mini;

        this.threadSub = this._thread
            .subscribe(thread => {
                if (thread) {
                    // this.form.get('_id').setValue(thread._id);
                    let createdAt = new Date(thread.createdAt);
                    let updatedAt = new Date(thread.updatedAt);

                    this.messagingService.getNumMessages(this.thread)
                        .subscribe(count => {
                            this.numReplies = count - 1;
                        }, err => console.error);


                    // this.messagingService.getMessagesForThread(this.thread._id)
                    //     .subscribe(messages => {
                    //         this.initialMessage = messages[0];
                    //     });
                }
            });

        combineLatest(
            this.authService.authInfo(),
            this.userPermissionDataService.permissions(),
            this._thread
        ).subscribe(([authInfo, permissions, thread]) => {
            const canAdminEntity = thread && permissions.canAdminEntity(thread.entityId, thread.entityType);
            const isThreadOwner = thread && authInfo.user && thread.createdBy._id === authInfo.user._id;

            this.canDeleteThread = canAdminEntity;
            this.canEditThread = canAdminEntity || isThreadOwner;
        }, err => console.error(err));
    }

    ngOnDestroy() {
        if (this.threadSub) this.threadSub.unsubscribe();
    }

    get thread() {
        return this._thread.getValue();
    }

    @Input()
    set thread(thread) {
        this._thread.next(thread);
    }

    showThread(): void {
        this.messagingService.showThread(this.thread);
    }

    removeThread(): void {
        this.messagingService.removeThread(this.thread)
            .subscribe(() => {
                this.deleteThread.emit();
            },
                err => {
                    console.error(err);
                    this.notificationService.error('Unable to remove the thread');
                });
    }
}
