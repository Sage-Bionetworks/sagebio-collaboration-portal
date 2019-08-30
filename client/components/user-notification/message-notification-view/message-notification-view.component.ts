import { Component, AfterViewInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'components/notification/notification.service';
import { UserNotificationService } from '../user-notification.service';
import { MessageNotification } from '../models/message-notificiation.model';


@Component({
    selector: 'message-notification-view',
    template: require('./message-notification-view.html'),
    styles: [require('./message-notification-view.scss')]
})
export class MessageNotificationViewComponent implements AfterViewInit, OnDestroy {
    @Input() message: MessageNotification;

    static parameters = [Router,
        NotificationService, UserNotificationService, UserNotificationService];
    constructor(private router: Router,
        private notificationService: NotificationService,
        private userNotificationService: UserNotificationService) { }

    ngAfterViewInit() { }

    ngOnDestroy() { }

    readMessage(): void {
        this.notificationService.info('Reading Message.');
    }

    archive() {
        this.notificationService.info('The message has been successfully archived.');
    }


}