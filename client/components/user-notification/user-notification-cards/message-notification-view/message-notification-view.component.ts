import { Component, Input } from '@angular/core';
import { MessageNotification } from 'models/user-notification/message-notificiation.model'
import { UserNotificationCardComponent } from '../user-notification-card.component';

@Component({
    selector: 'message-notification-view',
    template: require('./message-notification-view.html'),
    styles: [require('../user-notification-card.scss')]
})
export class MessageNotificationViewComponent extends UserNotificationCardComponent {
    @Input() notification: MessageNotification;
}
