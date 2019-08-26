import { Component, OnDestroy, OnInit, AfterViewInit, Input, ViewChild, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, BehaviorSubject, Subscription, combineLatest, of } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, filter, startWith, delay, switchMap, catchError } from 'rxjs/operators';

import { Thread } from 'models/messaging/thread.model';
import { Message } from 'models/messaging/message.model';
import { NotificationService } from 'components/notification/notification.service';
import { UserPermissionDataService } from 'components/auth/user-permission-data.service';
import { MessageStarButtonComponent } from '../message-star-button/message-star-button.component';
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

export class ThreadPreviewComponent {
    @Output() deleteThread: EventEmitter<Thread> = new EventEmitter<Thread>();
    // @ViewChild(MessageStarButtonComponent, { static: false }) starButton: MessageStarButtonComponent;

    private _thread: BehaviorSubject<Thread> = new BehaviorSubject<Thread>(undefined);
    private tooltipPosition = 'above';
    private tooltipShowDelay: number;
    private authorAvatarSize: number;
    private contributorAvatarSize: number;

    // private initialMessage: Message;
    // private starred: Observable<boolean>;
    private numReplies: number;

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
        this.authorAvatarSize = config.avatar.size.mini;
        this.contributorAvatarSize = config.avatar.size.nano;

        this._thread
            .pipe(
                filter(thread => !!thread),
                switchMap(thread => this.messagingService.getNumMessages(thread)),
                map(count => count - 1)
            )
            .subscribe(numReplies => {
                this.numReplies = numReplies;
            }, err => console.error(err));

        combineLatest(
            this.authService.authInfo(),
            this.userPermissionDataService.permissions(),
            this._thread
        ).subscribe(([authInfo, permissions, thread]) => {
            const canAdminEntity = thread && permissions.canAdminEntity(thread.entityId, thread.entityType);
            const canReadEntity = thread && permissions.canReadEntity(thread.entityId, thread.entityType);
            const isThreadOwner = thread && authInfo.user && thread.createdBy._id === authInfo.user._id;
            this.canDeleteThread = canAdminEntity;
            this.canEditThread = canAdminEntity || (canReadEntity && isThreadOwner);
        }, err => console.error(err));
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
