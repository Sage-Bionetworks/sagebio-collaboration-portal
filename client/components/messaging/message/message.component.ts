import { Component, OnInit, AfterViewInit, Input, ViewChild, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, BehaviorSubject, Subscription, combineLatest } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, filter, startWith, delay } from 'rxjs/operators';

import { Message } from 'models/messaging/message.model';
import { Thread } from 'models/messaging/thread.model';
import { NotificationService } from 'components/notification/notification.service';
import { AuthService } from 'components/auth/auth.service';

import { MessageStarButtonComponent } from '../message-star-button/message-star-button.component';
import { MessageReplyButtonComponent } from '../message-reply-button/message-reply-button.component';
import { MessagingService } from '../messaging.service';
import { MessagingDataService } from '../messaging-data.service';
import { UserPermissionDataService } from 'components/auth/user-permission-data.service';
import { UserService } from 'components/auth/user.service';

import config from '../../../app/app.constants';
import { DateAndTimePipe } from '../../pipes/date/date-and-time.pipe';
import { AppQuillEditorComponent } from 'components/quill/app-quill-editor/app-quill-editor.component';

const MESSAGE_EDITED_DELTA_T = 1000;  // 1 second

@Component({
    selector: 'message',
    template: require('./message.html'),
    styles: [require('./message.scss')],
    encapsulation: ViewEncapsulation.None
})
export class MessageComponent implements OnInit, AfterViewInit {
    @Output() deleteMessage: EventEmitter<Message> = new EventEmitter<Message>();
    @Output() editMessage: EventEmitter<Message> = new EventEmitter<Message>();

    @ViewChild('editor', { static: false }) editor: AppQuillEditorComponent;

    private _thread: BehaviorSubject<Thread> = new BehaviorSubject<Thread>(undefined);
    private _message: BehaviorSubject<Message> = new BehaviorSubject<Message>(undefined);
    private form: FormGroup;
    private edited = false;

    private tooltipPosition = 'above';
    private tooltipShowDelay: number;
    private avatarSize = 40;
    // @ViewChild(MessageStarButtonComponent, { static: false }) starButton: MessageStarButtonComponent;
    // @ViewChild(MessageReplyButtonComponent, { static: false }) replyButton: MessageReplyButtonComponent;

    // private starred: Observable<boolean>;
    // private numReplies: Observable<number>;

    private canDeleteMessage = false;
    private canEditMessage = false;

    static parameters = [
        FormBuilder,
        NotificationService,
        MessagingService,
        // MessagingDataService,
        UserPermissionDataService,
        AuthService
    ];
    constructor(
        private formBuilder: FormBuilder,
        private notificationService: NotificationService,
        private messagingService: MessagingService,
        // private messagingDataService: MessagingDataService,
        private userPermissionDataService: UserPermissionDataService,
        private authService: AuthService
        ) {

        this.tooltipShowDelay = config.tooltip.showDelay;
        this.avatarSize = config.avatar.size.mini;

        this.form = this.formBuilder.group({
            _id: [''],
            body: ['', [
                Validators.required,
                Validators.minLength(config.models.message.body.minlength),
                Validators.maxLength(config.models.message.body.maxlength)
            ]]
        });

        this._message
            .pipe(
                filter(message => !!message)
            )
            .subscribe(message => {
                this.form.get('_id').setValue(message._id);
                this.form.get('body').setValue(JSON.parse(message.body));
                let createdAt = new Date(message.createdAt);
                let updatedAt = new Date(message.updatedAt);
                this.edited = (updatedAt.getTime() - createdAt.getTime()) > MESSAGE_EDITED_DELTA_T;
            }, err => console.error(err));

        combineLatest(
            this.authService.authInfo(),
            this.userPermissionDataService.permissions(),
            this._thread,
            this._message
        ).subscribe(([authInfo, permissions, thread, message]) => {
            const canAdminEntity = thread && permissions.canAdminEntity(thread.entityId, thread.entityType);
            const canReadEntity = thread && permissions.canReadEntity(thread.entityId, thread.entityType);
            const isMessageOwner = message && authInfo.user && message.createdBy._id === authInfo.user._id;
            this.canDeleteMessage = canAdminEntity;
            this.canEditMessage = canAdminEntity || (canReadEntity && isMessageOwner);
        }, err => console.error(err));
    }

    ngOnInit() { }

    ngAfterViewInit() { }

    ngOnDestroy() {
        // if (this.messageSub) this.messageSub.unsubscribe();
        // if (this.getMessageSub) this.getMessageSub.unsubscribe();
    }

    get thread() {
        return this._thread.getValue();
    }

    @Input()
    set thread(thread) {
        this._thread.next(thread);
    }

    get message() {
        return this._message.getValue();
    }

    @Input()
    set message(message) {
        this._message.next(message);
    }

    // @Input()
    // set messageId(messageId) {
    //     if (!this.getMessageSub) {
    //         this.getMessageSub.unsubscribe();
    //     }
    //     this.getMessageSub = this.messagingService.getMessage(messageId)
    //         .subscribe(message => this._message.next(message),
    //             err => {
    //                 console.log('Unable to get message', err);
    //             });
    // }

    updateMessage(): void {
        let updatedMessage = this.form.value;
        updatedMessage.body = JSON.stringify(this.form.get('body').value);
        updatedMessage.thread = this.thread._id;

        this.messagingService.updateMessage(this.thread, updatedMessage)
            .subscribe(message => {
                this.editMessage.emit();
             }, err => {
                console.error('Unable to update the message', err);
                this.notificationService.error('Unable to update the message');
                this.editor.edit();
            });
    }

    removeMessage(): void {
        this.messagingService.removeMessage(this.thread, this.form.value)
            .subscribe(() => {
                this.deleteMessage.emit();
            }, err => {
                console.error('Unable to remove the message', err);
                this.notificationService.error('Unable to remove the message');
            });
    }
}
