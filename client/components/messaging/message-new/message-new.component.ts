import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { QuillEditorComponent } from 'ngx-quill';

import { NotificationService } from '../../../components/notification/notification.service';
import { Message } from '../../../../shared/interfaces/discussion/message.model';
import { MessagingService } from '../messaging.service';


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
            body: ['test']
        });
    }

    ngOnInit() {
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

    createNewMessage(): void {


      // slug: string;
      // title: string;
      // body: string;

      let newMessage = this.form.value;
      newMessage.body = JSON.stringify(this.form.get('body').value);
      console.log('Message to POST', newMessage);
      this.messagingService.createMessage(newMessage)
          .subscribe(message => {
              // this.newProject.emit(project);
          }, err => {
              console.log('ERROR', err);
              // this.errors.createNewMessage = err.message;
          });



      // console.log('stringify', JSON.stringify(this.form.get('editor').value));
    }
}
