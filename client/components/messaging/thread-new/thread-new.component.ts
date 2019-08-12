import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { AppQuillEditorComponent } from 'components/quill/app-quill-editor/app-quill-editor.component';
import { NotificationService } from 'components/notification/notification.service';
import { ObjectValidators } from '../../validation/object-validators';
import { Thread } from 'models/messaging/thread.model';
import { Message } from 'models/messaging/message.model';
import { MessagingService } from '../messaging.service';
import { SecondarySidenavService } from '../../sidenav/secondary-sidenav/secondary-sidenav.service';
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
            })
    }

    addMessage(): void {
        let newMessage = this.form.value;
        newMessage.body = JSON.stringify(this.form.get('body').value);
        if (this.thread) {
            newMessage.thread = this.thread;
        }
        this.messagingService.addMessage(newMessage)
            .subscribe(message => {
                // WIP - Do not load the newly created thread in the sidebar
                // Load the newly created thread in the sidebar
                this.messagingService.showThread(this.thread);
            }, err => {
                console.log('ERROR', err);
                this.errors.createNewMessage = err.message;
            });
    }

    close(): void {
        this.secondarySidenavService.close();
        this.secondarySidenavService.destroyContentComponent();
    }

}
