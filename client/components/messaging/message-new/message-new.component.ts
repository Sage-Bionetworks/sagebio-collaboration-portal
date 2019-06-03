import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { QuillEditorComponent } from 'ngx-quill';

import { NotificationService } from '../../../components/notification/notification.service';
import { ObjectValidators } from '../../validation/object-validators';
import { Message } from '../../../../shared/interfaces/discussion/message.model';
import { MessagingService } from '../messaging.service';
import { models } from '../../../app/app.constants';


@Component({
    selector: 'message-new',
    template: require('./message-new.html'),
    styles: [require('./message-new.scss')],
})
export class MessageNewComponent implements OnInit {
    @ViewChild('editor') editor: QuillEditorComponent;
    private hide = false;
    private form: FormGroup;

    static parameters = [FormBuilder, NotificationService, MessagingService];
    constructor(private formBuilder: FormBuilder,
        private notificationService: NotificationService,
        private messagingService: MessagingService) {

        this.form = formBuilder.group({
            body: ['', [
                Validators.required,
                ObjectValidators.jsonStringifyMinLength(models.message.body.minlength),
                ObjectValidators.jsonStringifyMaxLength(models.message.body.maxlength)
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
                console.log('value of body', this.form.get('body').value);

                // console.log('native fromControl value changes with debounce', data);
                // console.log(JSON.stringify(data).length);
            });
    }

    addMessage(): void {
        let newMessage = this.form.value;
        newMessage.body = JSON.stringify(this.form.get('body').value);
        console.log('Message to POST', newMessage);
        this.messagingService.addMessage(newMessage)
            .subscribe(message => {
                // this.newProject.emit(project);
            }, err => {
                console.log('ERROR', err);
                // this.errors.createNewMessage = err.message;
            });



        // console.log('stringify', JSON.stringify(this.form.get('editor').value));
    }
}
