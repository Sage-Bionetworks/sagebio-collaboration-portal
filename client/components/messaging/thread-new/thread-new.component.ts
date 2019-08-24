import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError, tap } from 'rxjs/operators';
import { NotificationService } from 'components/notification/notification.service';
import { SecondarySidenavService } from 'components/sidenav/secondary-sidenav/secondary-sidenav.service';
import { ObjectValidators } from 'components/validation/object-validators';
import { Thread } from 'models/messaging/thread.model';
import { Message } from 'models/messaging/message.model';
import { MessagingService } from '../messaging.service';
import config from '../../../app/app.constants';

@Component({
    selector: 'thread-new',
    template: require('./thread-new.html'),
    styles: [require('./thread-new.scss')],
})
export class ThreadNewComponent implements OnInit {
    @Input() entityId: string;
    @Input() entityType: string;
    @Output() newThread: EventEmitter<Thread> = new EventEmitter<Thread>();
    @Output() close: EventEmitter<any> = new EventEmitter<any>();

    // private thread: Thread;
    private messageSpecs: {};
    private form: FormGroup;
    private errors = {
        createNewThread: undefined
    };

    static parameters = [FormBuilder, NotificationService, MessagingService, SecondarySidenavService];
    constructor(private formBuilder: FormBuilder,
        private notificationService: NotificationService,
        private messagingService: MessagingService,
        private secondarySidenavService: SecondarySidenavService,
        ) {

        this.messageSpecs = config.models.message;
        this.form = formBuilder.group({
            title: ['', [
                Validators.required,
                ObjectValidators.jsonStringifyMinLength(config.models.message.title.minlength),
                ObjectValidators.jsonStringifyMaxLength(config.models.message.title.maxlength)
            ]],
            body: ['', [
                Validators.required,
                ObjectValidators.jsonStringifyMinLength(config.models.message.body.minlength),
                ObjectValidators.jsonStringifyMaxLength(config.models.message.body.maxlength)
            ]]
        });
    }

    ngOnInit() {
        this.form
            .controls
            .body
            .valueChanges.pipe(
                debounceTime(50),
                distinctUntilChanged()
            )
            .subscribe((data) => {
                this.errors.createNewThread = undefined;
            });
    }

    createThread(): void {
        let newThread = this.form.value;
        newThread.entityId = this.entityId;
        newThread.entityType = this.entityType;

        // TODO Emit thread after creating message
        let threadFromBackend: Thread;
        this.messagingService.createThread(newThread)
            .pipe(
                tap(thread => {
                    threadFromBackend = thread;
                    console.log('thread created', thread);
                }),
                switchMap(thread => this.createMessage(thread)
                    .pipe(
                        catchError(err => {
                            console.error(`Unable to add message to thread: ${thread._id}`, err);
                            return of(<Message>{});
                        })
                    )
                )
            )
            .subscribe(message => {
                this.newThread.emit(threadFromBackend);
            }, err => {
                console.error(err);
                // TODO Emit error
            });
    }

    createMessage(thread: Thread): Observable<Message> {
        let newMessage = this.form.value;
        newMessage.body = JSON.stringify(this.form.get('body').value);
        return this.messagingService.createMessage(thread, newMessage);
    }

    discard(): void {
        this.close.emit(null);
    }
}
