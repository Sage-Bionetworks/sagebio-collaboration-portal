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
import config from '../../../app/app.constants';

@Component({
    selector: 'message-new',
    template: require('./message-new.html'),
    styles: [require('./message-new.scss')],
})
export class MessageNewComponent implements OnInit {
    @Input() private thread: Thread;
    @Output() newMessage: EventEmitter<Message> = new EventEmitter<Message>();

    private messageSpecs: any;
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
                ObjectValidators.jsonStringifyMinLength(this.messageSpecs.body.minlength),
                ObjectValidators.jsonStringifyMaxLength(this.messageSpecs.body.maxlength)
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
        newMessage.thread = this.thread._id;

        this.messagingService.createMessage(this.thread, newMessage)
            .subscribe(message => {
              this.newMessage.emit(message);
              this.form.reset();
            }, err => {
                console.error('Unable to add message to thread', err);
                this.errors.createNewMessage = err.message;
            });
    }
}
