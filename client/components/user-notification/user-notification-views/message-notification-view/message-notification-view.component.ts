import { Component, AfterViewInit, OnDestroy, Input } from '@angular/core';
import { NotificationService } from 'components/notification/notification.service';
import { UserNotificationService } from '../../user-notification.service';
import { MessageNotification } from 'models/user-notification/message-notificiation.model'

// import { MessageNotification } from '../models/message-notificiation.model';
// import { NotificationBundle } from '../models/notification-bundle.model';
// import { UserNotificationBundle } from 'models/user-notification/user-notification-bundle.model'

@Component({
    selector: 'message-notification-view',
    template: require('./message-notification-view.html'),
    styles: [require('../user-notification-view.scss')]
})
export class MessageNotificationViewComponent implements AfterViewInit, OnDestroy {
    @Input() messageNotification: MessageNotification;

    static parameters = [NotificationService, UserNotificationService];
    constructor(
        private notificationService: NotificationService,
        private userNotificationService: UserNotificationService
    ) { }

    ngAfterViewInit() { }

    ngOnDestroy() { }

    discard() {
        this.userNotificationService.archiveNotification(this.messageNotification).subscribe(() => {
            this.notificationService.info('Notification discarded.');
        })
    }
}
