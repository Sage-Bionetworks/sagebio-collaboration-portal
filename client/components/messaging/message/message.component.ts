import { Component, OnInit, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { QuillEditorComponent } from 'ngx-quill';

import { NotificationService } from '../../../components/notification/notification.service';
import { Message } from '../../../../shared/interfaces/discussion/message.model';
import { UserProfile } from '../../../../shared/interfaces/user-profile.model';
import { MessagingService } from '../messaging.service';
import { AppQuillEditorToolbarComponent } from '../../quill/app-quill-editor-toolbar/app-quill-editor-toolbar.component';

const MESSAGE_EDITED_DELTA_T = 1000;  // 1 second

@Component({
    selector: 'message',
    template: require('./message.html'),
    styles: [require('./message.scss')],
    encapsulation: ViewEncapsulation.None
})
export class MessageComponent implements OnInit {
    private _message: Message;
    private tooltipPosition = 'above';

    @ViewChild('editor') editor: QuillEditorComponent;
    private hide = false;
    private form: FormGroup;
    private isReadOnly = true;
    private edited = false;

    static parameters = [FormBuilder, NotificationService, MessagingService];
    constructor(private formBuilder: FormBuilder,
        private notificationService: NotificationService,
        private messagingService: MessagingService) {

        this.form = formBuilder.group({
            _id: [''],
            body: ['']
        });
    }

    // save JSON.stringify(this.form.get('editor').value)
    // read from message.body

    ngOnInit() {
        // this.editor.format = 'html';
        // console.log('EDITOR FORMAT', this.editor.format);

        this.form
            .controls
            .body
            .valueChanges.pipe(
                debounceTime(400),
                distinctUntilChanged()
            )
            .subscribe((data) => {
                console.log('native fromControl value changes with debounce', data);
            });
    }

    get message() {
        return this._message;
    }

    @Input()
    set message(message) {
        this._message = message;
        this.form.get('_id').setValue(message._id);
        this.form.get('body').setValue(JSON.parse(message.body));

        let createdAt = new Date(message.createdAt);
        let updatedAt = new Date(message.updatedAt);
        this.edited = (updatedAt.getTime() - createdAt.getTime()) > MESSAGE_EDITED_DELTA_T;
    }

    updateMessage(): void {
        let updatedMessage = this.form.value;
        updatedMessage.body = JSON.stringify(this.form.get('body').value);
        console.log('Message to UPDATE', updatedMessage);
        this.messagingService.updateMessage(updatedMessage)
            .subscribe(message => {
                console.log('message successfully updated', message);
                // this.newProject.emit(project);
            }, err => {
                console.log('ERROR', err);
                // this.errors.createNewMessage = err.message;
            });


        this.isReadOnly = true;
    }

    removeMessage(): void {
        this.messagingService.removeMessage(this.message)
            .subscribe(message => {
                console.log('This message has been removed', message);
            }, err => {
                console.log('Unable to remove the message', err);
                this.notificationService.error('Unable to remove the message');
            });
    }

    replyToMessage(): void {
        this.notificationService.info('Not yet implemented');
    }

    starMessage(): void {
        this.notificationService.info('Not yet implemented');
    }

    ngAfterViewInit() {

    }
}
