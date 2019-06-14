import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { QuillEditorComponent } from 'ngx-quill';
import { NotificationService } from '../../../components/notification/notification.service';
import { ObjectValidators } from '../../validation/object-validators';
import { Message } from '../../../../shared/interfaces/messaging/message.model';
import { MessagingService } from '../messaging.service';
import config from '../../../app/app.constants';

@Component({
    selector: 'message-new',
    template: require('./message-new.html'),
    styles: [require('./message-new.scss')],
})
export class MessageNewComponent implements OnInit {
    @Input() private thread: Message;
    @ViewChild('editor', { static: false }) editor: QuillEditorComponent;
    private hide = false;
    private form: FormGroup;
    private errors = {
        createNewMessage: undefined
    };

    static parameters = [FormBuilder, NotificationService, MessagingService];
    constructor(private formBuilder: FormBuilder,
        private notificationService: NotificationService,
        private messagingService: MessagingService) {

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

    addMessage(): void {
        let newMessage = this.form.value;
        newMessage.body = JSON.stringify(this.form.get('body').value);
        if (this.thread) {
            newMessage.thread = this.thread._id;
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
