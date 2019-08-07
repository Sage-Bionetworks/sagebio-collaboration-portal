import { Component, OnInit, Input, ViewChild } from '@angular/core';
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
import config from '../../../app/app.constants';

@Component({
    selector: 'thread-new',
    template: require('./thread-new.html'),
    styles: [require('./thread-new.scss')],
})
export class ThreadNewComponent implements OnInit {
    @Input() private thread: Message | Thread;

    private messageSpecs: {};
    private form: FormGroup;
    private errors = {
        createNewMessage: undefined
    };

    static parameters = [FormBuilder, NotificationService, MessagingService];
    constructor(private formBuilder: FormBuilder,
        private notificationService: NotificationService,
        private messagingService: MessagingService) {

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
        newThread.title = JSON.stringify(this.form.get('title').value);

        this.messagingService.addThread(newThread)
            .subscribe(thread => {
                console.log(`Created thread ${thread.title} (ID ${thread._id})`);
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
              this.form.reset();
            }, err => {
                console.log('ERROR', err);
                this.errors.createNewMessage = err.message;
            });
    }
}
