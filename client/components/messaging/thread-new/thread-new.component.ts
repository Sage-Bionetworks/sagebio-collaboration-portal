import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'components/notification/notification.service';
import { Thread } from 'models/messaging/thread.model';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import config from '../../../app/app.constants';
import { SecondarySidenavService } from '../../sidenav/secondary-sidenav/secondary-sidenav.service';
import { ObjectValidators } from '../../validation/object-validators';
import { MessagingService } from '../messaging.service';

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

    private thread: Thread;
    private messageSpecs: {};
    private form: FormGroup;
    private errors = {
        createNewMessage: undefined
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
                this.errors.createNewMessage = undefined;
            });
    }

    addThread(): void {
        let newThread = this.form.value;

        // Add entity-specific details where applicable
        if (this.entityId) {
            newThread.entityId = this.entityId;
            newThread.entityType = this.entityType || config.entityTypes.PROJECT.value; // DEFAULT entity type is project
        }

        this.messagingService.addThread(newThread)
            .subscribe(thread => {
                this.newThread.emit(thread);
                this.thread = thread;

                // Once the thread has been created successfully, create the message
                this.addMessage();
            });
    }

    addMessage(): void {
        let newMessage = this.form.value;
        newMessage.body = JSON.stringify(this.form.get('body').value);
        if (this.thread) {
            newMessage.thread = this.thread;
        }
        this.messagingService.addMessage(newMessage)
            .subscribe(message => {
                // // Load the newly created thread in the sidebar
                // this.messagingService.showThread(this.thread);
            }, err => {
                console.error(err);
                this.errors.createNewMessage = err.message;
            });
    }

    discard(): void {
        this.close.emit(null);
    }
}
