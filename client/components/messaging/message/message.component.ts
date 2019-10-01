import { Component, Input, ViewChild, ViewEncapsulation, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Message } from 'models/messaging/message.model';
import { Thread } from 'models/messaging/thread.model';
import { NotificationService } from 'components/notification/notification.service';
import { AuthService } from 'components/auth/auth.service';
import { AppQuillEditorComponent } from 'components/quill/app-quill-editor/app-quill-editor.component';
import { UserPermissionDataService } from 'components/auth/user-permission-data.service';
import { MessagingService } from '../messaging.service';
import config from '../../../app/app.constants';
import { cloneDeep } from 'lodash';

const MESSAGE_EDITED_DELTA_T = 1000; // 1 second

@Component({
    selector: 'message',
    template: require('./message.html'),
    styles: [require('./message.scss')],
    encapsulation: ViewEncapsulation.None,
})
export class MessageComponent implements OnInit {
    @Input() private thread: Thread;
    private _message: Message;

    @ViewChild('editor', { static: false }) editor: AppQuillEditorComponent;

    private messageSpecs: any;
    private form: FormGroup;
    private edited = false; // used in html
    private avatarSize: number; // used in html
    private canDeleteMessage = false; // used in html
    private canEditMessage = false; // used in html

    static parameters = [FormBuilder, NotificationService, AuthService, UserPermissionDataService, MessagingService];
    constructor(
        private formBuilder: FormBuilder,
        private notificationService: NotificationService,
        private authService: AuthService,
        private userPermissionDataService: UserPermissionDataService,
        private messagingService: MessagingService
    ) {
        this.messageSpecs = config.models.message;
        this.avatarSize = config.avatar.size.mini;
        this.form = this.formBuilder.group({
            _id: [''],
            body: [
                '',
                [
                    Validators.required,
                    Validators.minLength(this.messageSpecs.body.minlength),
                    Validators.maxLength(this.messageSpecs.body.maxlength),
                ],
            ],
        });
    }

    get message() {
        return this._message;
    }

    @Input()
    set message(message) {
        this.setMessage(message);
    }

    ngOnInit() {
        combineLatest(this.authService.authInfo(), this.userPermissionDataService.permissions()).subscribe(
            ([authInfo, permissions]) => {
                const canAdminEntity =
                    this.thread && permissions.canAdminEntity(this.thread.entityId, this.thread.entityType);
                const canReadEntity =
                    this.thread && permissions.canReadEntity(this.thread.entityId, this.thread.entityType);
                const isMessageOwner =
                    this.message && authInfo.user && this.message.createdBy._id === authInfo.user._id;
                this.canDeleteMessage = canAdminEntity;
                this.canEditMessage = canAdminEntity || (canReadEntity && isMessageOwner);
            },
            err => console.error(err)
        );
    }

    setMessage(message: Message): void {
        this._message = message;
        this.form.setValue({
            _id: message._id,
            body: JSON.parse(message.body),
        });
        let createdAt = new Date(message.createdAt);
        let updatedAt = new Date(message.updatedAt);
        this.edited = updatedAt.getTime() - createdAt.getTime() > MESSAGE_EDITED_DELTA_T;
    }

    updateMessage(): void {
        let updatedMessage = cloneDeep(this.message);
        updatedMessage.body = JSON.stringify(this.form.controls.body.value);

        this.messagingService.updateMessage(this.thread, updatedMessage).subscribe(
            message => {
                console.log('Updated message', message);
                this.setMessage(message);
            },
            err => {
                console.error('Unable to update the message', err);
                this.notificationService.error('Unable to update the message');
                this.editor.edit();
            }
        );
    }

    removeMessage(): void {

        this.messagingService.removeMessage(this.thread, this.message).subscribe(
            () => {
                // this.messageDeleted.emit();
            },
            err => {
                console.error('Unable to remove the message', err);
                this.notificationService.error('Unable to remove the message');
            }
        );
    }
}
