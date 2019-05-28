import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { NotificationService } from '../../../components/notification/notification.service';
import { Message } from '../../../../shared/interfaces/discussion/message.model';
import { UserProfile } from '../../../../shared/interfaces/user-profile.model';


@Component({
    selector: 'message',
    template: require('./message.html'),
    styles: [require('./message.scss')],
})
export class MessageComponent implements OnInit {
    private _message: Message;
    private tooltipPosition = 'above';

    static parameters = [NotificationService];
    constructor(private notificationService: NotificationService) { }

    ngOnInit() { }

    get message() {
        return this._message;
    }

    @Input()
    set message(message) {
        this._message = message;
        console.log('message', message);
    }

    editMessage(): void {
        this.notificationService.info('Not yet implemented');
    }

    deleteMessage(): void {
        this.notificationService.info('Not yet implemented');
    }
}
