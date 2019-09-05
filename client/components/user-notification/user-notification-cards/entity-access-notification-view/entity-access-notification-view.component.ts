import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'components/notification/notification.service';
import { UserNotificationBundle } from 'models/user-notification/user-notification-bundle.model'
import { EntityAccessNotification } from 'models/user-notification/entity-access-notificiation.model';

@Component({
    selector: 'entity-access-notification-view',
    template: require('./entity-access-notification-view.html'),
    styles: [require('../user-notification-card.scss')]
})
export class EntityAccessNotificationViewComponent {
    @Input() entityAccessNotification: UserNotificationBundle<EntityAccessNotification>;

    static parameters = [Router, NotificationService];
    constructor(private router: Router, private notificationService: NotificationService) { }

    accept() {
        // this.userPermissionDataService.acceptEntityPermission(this.invite.entityPermission)
        //     .subscribe(entityPermission => {
        //         this.notificationService.info('The invite has been successfully accepted.');
        //     }, err => {
        //         console.log(err);
        //         this.notificationService.error('Unable to accept the invite', err);
        //     });
        this.notificationService.info('entityAccessNotification Accepted.');
    }

    acceptAndGo() {
        // this.userPermissionDataService.acceptEntityPermission(this.invite.entityPermission)
        //     .subscribe(entityPermission => {
        //         this.userNotificationService.toggleNotifications();
        //         this.notificationService.info('The invite has been successfully accepted.');
        //         this.router.navigate(['projects/', entityPermission.entityId]);
        //     }, err => {
        //         console.log(err);
        //         this.notificationService.error('Unable to accept the invite', err);
        //     });
        this.notificationService.info('The entityAccessNotification has been acepted and now redirecting');
    }

    decline() {
        // this.userPermissionDataService.declineEntityPermission(this.invite.entityPermission)
        //     .subscribe(entityPermission => {
        //         this.notificationService.info('The invite has been successfully declined.');
        //     }, err => {
        //         console.log(err);
        //         this.notificationService.error('Unable to decline the invite', err);
        //     });
    }
}
