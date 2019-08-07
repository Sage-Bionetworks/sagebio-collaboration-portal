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
    selector: 'message-new',
    template: require('./message-new.html'),
    styles: [require('./message-new.scss')],
})
export class MessageNewComponent implements OnInit {
    @Input() private message: Message;

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

    addMessageToThread(): void {
        let newMessage = this.form.value;
        newMessage.body = JSON.stringify(this.form.get('body').value);
        newMessage.thread = this.message.thread;
        console.log(`message-new wants to add newMessage: ${JSON.stringify(newMessage, null, 2)}`);

        this.messagingService.addMessageToThread(newMessage, newMessage.thread)
            .subscribe(message => {
              console.log(`message-new received message: ${JSON.stringify(message, null, 2)}`);
              this.form.reset();
            }, err => {
                console.log('ERROR', err);
                this.errors.createNewMessage = err.message;
            });
    }
}
