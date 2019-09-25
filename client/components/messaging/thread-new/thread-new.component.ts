import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of, forkJoin } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError, tap } from 'rxjs/operators';
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

    private threadSpecs: any;
    private messageSpecs: any;
    private form: FormGroup;
    private errors = {
        newThread: undefined,
    };

    static parameters = [FormBuilder, MessagingService];
    constructor(private formBuilder: FormBuilder, private messagingService: MessagingService) {
        this.threadSpecs = config.models.thread;
        this.messageSpecs = config.models.message;
        this.form = this.formBuilder.group({
            title: [
                '',
                [
                    Validators.required,
                    Validators.minLength(this.threadSpecs.title.minlength),
                    Validators.maxLength(this.threadSpecs.title.maxlength),
                ],
            ],
            body: [
                '',
                [
                    Validators.required,
                    ObjectValidators.jsonStringifyMinLength(this.messageSpecs.body.minlength),
                    ObjectValidators.jsonStringifyMaxLength(this.messageSpecs.body.maxlength),
                ],
            ],
        });
    }

    ngOnInit() {}

    createThread(): void {
        let newThread = {
            title: this.form.controls.title.value,
            entityId: this.entityId,
            entityType: this.entityType,
        };

        this.messagingService
            .createThread(newThread)
            .pipe(
                switchMap(thread =>
                    forkJoin({
                        thread: of(thread),
                        message: this.createMessage(thread).pipe(
                            catchError(err => {
                                // TODO Delete thread if message is empty
                                console.error(`Unable to add message to thread: ${thread._id}`, err);
                                this.errors.newThread = err;
                                return of(<Message>{});
                            })
                        ),
                    })
                )
            )
            .subscribe(
                (res: any) => {
                    this.newThread.emit(res.thread);
                },
                err => {
                    console.error('Unable to create thread', err);
                    this.errors.newThread = err;
                }
            );
    }

    createMessage(thread: Thread): Observable<Message> {
        let newMessage = {
            thread: thread._id,
            body: JSON.stringify(this.form.controls.body.value),
        };
        return this.messagingService.createMessage(thread, newMessage);
    }
}
