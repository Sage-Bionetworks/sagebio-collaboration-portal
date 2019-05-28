import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { QuillEditorComponent } from 'ngx-quill';
import { NotificationService } from '../../../components/notification/notification.service';
import { Message } from '../../../../shared/interfaces/discussion/message.model';
// import { UserProfile } from '../../../../shared/interfaces/user-profile.model';


@Component({
    selector: 'message-new',
    template: require('./message-new.html'),
    styles: [require('./message-new.scss')],
})
export class MessageNewComponent implements OnInit {
    static parameters = [NotificationService];
    constructor(private notificationService: NotificationService) { }

    ngOnInit() { }
}
