import { Component, OnInit, AfterViewInit, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, filter, startWith, delay } from 'rxjs/operators';
import { QuillEditorComponent } from 'ngx-quill';
import { Message } from '../../../../shared/interfaces/discussion/message.model';
import { AppQuillEditorToolbarComponent } from '../../quill/app-quill-editor-toolbar/app-quill-editor-toolbar.component';
import { NotificationService } from '../../../components/notification/notification.service';
import { MessageStarButtonComponent } from '../message-star-button/message-star-button.component';
import { MessageReplyButtonComponent } from '../message-reply-button/message-reply-button.component';
import { MessagingService } from '../messaging.service';
import { MessagingDataService } from '../messaging-data.service';
import config from '../../../app/app.constants';
import { DateAndTimePipe } from '../../pipes/date/date-and-time.pipe';

const MESSAGE_EDITED_DELTA_T = 1000;  // 1 second

@Component({
    selector: 'message',
    template: require('./message.html'),
    styles: [require('./message.scss')],
    encapsulation: ViewEncapsulation.None
})
export class MessageComponent implements OnInit, AfterViewInit {
    @Input('showReplyButton') private showReplyButton = true;
    @Input('showStartThreadButton') private showStartThreadButton = true;

    private _message: BehaviorSubject<Message> = new BehaviorSubject<Message>(undefined);
    private tooltipPosition = 'above';
    @ViewChild('editor') editor: QuillEditorComponent;
    @ViewChild(MessageStarButtonComponent) starButton: MessageStarButtonComponent;
    @ViewChild(MessageReplyButtonComponent) replyButton: MessageReplyButtonComponent;

    private starred: Observable<boolean>;
    private numReplies: Observable<number>;

    private hide = false;
    private form: FormGroup;
    private isReadOnly = true;
    private edited = false;
    private messageSub: Subscription;
    private getMessageSub: Subscription;
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
    }

    ngOnInit() {

        // this.form
        //     .controls
        //     .body
        //     .valueChanges.pipe(
        //         debounceTime(400),
        //         distinctUntilChanged()
        //     )
        //     .subscribe((data) => {
        //         console.log('native fromControl value changes with debounce', data);
        //     });
    }

    ngAfterViewInit() {
        this.starred = this.starButton.isStarred()
            .pipe(
                startWith(null),
                delay(0)
            );
        if (this.replyButton) {
            this.numReplies = this.replyButton.getNumReplies()
                .pipe(
                    startWith(null),
                    delay(0)
                );
        }
    }

    ngOnDestroy() {
        if (this.messageSub) this.messageSub.unsubscribe();
        // if (this.starredSub) this.starredSub.unsubscribe();
        if (this.getMessageSub) this.getMessageSub.unsubscribe();
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
                    console.log(err);
                    console.log('Unable to get message', err);
                });
    }

    updateMessage(): void {
        let updatedMessage = this.form.value;
        updatedMessage.body = JSON.stringify(this.form.get('body').value);
        this.messagingService.updateMessage(updatedMessage)
            .subscribe(message => { },
                err => {
                    console.log(err);
                    this.notificationService.error('Unable to update the message');
                });
        this.isReadOnly = true;
    }

    removeMessage(): void {
        this.messagingService.removeMessage(this.message)
            .subscribe(() => { },
                err => {
                    console.log(err);
                    this.notificationService.error('Unable to remove the message');
                });
    }

    replyToMessage(): void {
        this.notificationService.info('Not yet implemented');
    }
}
