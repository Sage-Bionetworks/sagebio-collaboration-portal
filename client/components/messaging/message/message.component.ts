import { Component, OnInit, AfterViewInit, Input, ViewChild, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, filter, startWith, delay } from 'rxjs/operators';

import { Message } from 'models/messaging/message.model';
import { Thread } from 'models/messaging/thread.model';
import { NotificationService } from 'components/notification/notification.service';
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
    @Input() private showReplyButton = true;
    @Input() private showStartThreadButton = true;
    @Output() deleteMessage: EventEmitter<Message> = new EventEmitter<Message>();
    @Output() editMessage: EventEmitter<Message> = new EventEmitter<Message>();

    private _message: BehaviorSubject<Message> = new BehaviorSubject<Message>(undefined);
    private showMessageActions = false;
    private canDeleteMessage = false;
    private canEditMessage = false;
    private tooltipPosition = 'above';
    @ViewChild(MessageStarButtonComponent, { static: false }) starButton: MessageStarButtonComponent;
    @ViewChild(MessageReplyButtonComponent, { static: false }) replyButton: MessageReplyButtonComponent;

    private starred: Observable<boolean>;
    private numReplies: Observable<number>;

    private form: FormGroup;
    private edited = false;
    private messageSub: Subscription;
    private getMessageSub: Subscription;
    private tooltipShowDelay: number;
    private avatarSize = 40;
    private userId: string;

    static parameters = [FormBuilder, NotificationService, MessagingService, MessagingDataService, UserPermissionDataService, UserService];

    constructor(private formBuilder: FormBuilder,
        private notificationService: NotificationService,
        private messagingService: MessagingService,
        private messagingDataService: MessagingDataService,
        private userPermissionDataService: UserPermissionDataService,
        private userService: UserService) {

        this.form = formBuilder.group({
            _id: [''],
            body: ['', [
                Validators.required,
                Validators.minLength(config.models.message.body.minlength),
                Validators.maxLength(config.models.message.body.maxlength)
            ]]
        });

        this.messageSub = this._message
            .subscribe(message => {
                if (message) {
                    this.form.get('_id').setValue(message._id);
                    this.form.get('body').setValue(JSON.parse(message.body));
                    let createdAt = new Date(message.createdAt);
                    let updatedAt = new Date(message.updatedAt);
                    this.edited = (updatedAt.getTime() - createdAt.getTime()) > MESSAGE_EDITED_DELTA_T;
                }
            });

        this.tooltipShowDelay = config.tooltip.showDelay;
        this.avatarSize = config.avatar.size.mini;

        // Get the current user ID
        this.userService.get()
            .subscribe(user => {
                this.userId = user._id;
            });

        this.userPermissionDataService.permissions()
            .subscribe(permissions => {
                // Eventually permissions should be implemented for user editing of messages
                this.canDeleteMessage = permissions.isAdmin();
                this.canEditMessage = permissions.isAdmin();
                this.showMessageActions = this.canDeleteMessage || this.canEditMessage;
            });
    }

    ngOnInit() { }

    ngAfterViewInit() { }

    ngOnDestroy() {
        if (this.messageSub) this.messageSub.unsubscribe();
        if (this.getMessageSub) this.getMessageSub.unsubscribe();
    }

    get displayMoreActionsMenu() {
        return this.canEditMessage || this.canDeleteMessage;
    }

    get message() {
        return this._message.getValue();
    }

    @Input()
    set message(message) {
        this._message.next(message);
    }

    @Input()
    set messageId(messageId) {
        if (!this.getMessageSub) {
            this.getMessageSub.unsubscribe();
        }
        this.getMessageSub = this.messagingService.getMessage(messageId)
            .subscribe(message => this._message.next(message),
                err => {
                    console.log('Unable to get message', err);
                });
    }

    updateMessage(): void {
        let updatedMessage = this.form.value;
        updatedMessage.body = JSON.stringify(this.form.get('body').value);
        updatedMessage.updatedBy = this.userId;

        this.messagingService.updateMessage(updatedMessage)
            .subscribe(message => {
                this.editMessage.emit();
             },
                err => {
                    console.log(err);
                    this.notificationService.error('Unable to update the message');
                });
        // this.isReadOnly = true;
    }

    removeMessage(): void {
        this.messagingService.removeMessage(this.message)
            .subscribe(() => {
                this.deleteMessage.emit();
            },
                err => {
                    console.log(err);
                    this.notificationService.error('Unable to remove the message');
                });
    }

    replyToMessage(): void {
        this.notificationService.info('Not yet implemented');
    }
}
