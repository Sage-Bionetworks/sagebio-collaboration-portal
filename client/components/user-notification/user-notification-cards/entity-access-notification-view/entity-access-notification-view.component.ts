import { Component, Input, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'components/notification/notification.service';
import { EntityAccessNotification } from 'models/user-notification/entity-access-notificiation.model';
import { UserPermissionDataService } from 'components/auth/user-permission-data.service';
import { EntityPermission } from 'models/auth/entity-permission.model';
import { UserNotificationCardComponent } from '../user-notification-card.component';
import { UserNotificationService } from 'components/user-notification/user-notification.service';
@Component({
    selector: 'entity-access-notification-view',
    template: require('./entity-access-notification-view.html'),
    styles: [require('../user-notification-card.scss')]
})
export class EntityAccessNotificationViewComponent extends UserNotificationCardComponent{
    @Input() notification: EntityAccessNotification;
    @Input() permission: EntityPermission

    static parameters = [Injector];
    constructor(public injector: Injector) {
        super(injector)
    }

    accept() {
        // this.userPermissionDataService.acceptEntityPermission(this.permission)
        //     .subscribe(entityPermission => {
        //         this.notificationService.info('The invite has been successfully accepted.');
        //     }, err => {
        //         console.log(err);
        //         this.notificationService.error('Unable to accept the invite', err);
        //     });
        // this.notificationService.info('entityAccessNotification Accepted.');
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
