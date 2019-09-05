import { Component, Input, Injector } from '@angular/core';
import { EntityAccessNotification } from 'models/user-notification/entity-access-notificiation.model';
import { UserPermissionDataService } from 'components/auth/user-permission-data.service';
import { EntityPermission } from 'models/auth/entity-permission.model';
import { UserNotificationCardComponent } from '../user-notification-card.component';
import { combineLatest } from 'rxjs';
@Component({
    selector: 'entity-access-notification-view',
    template: require('./entity-access-notification-view.html'),
    styles: [require('../user-notification-card.scss')]
})
export class EntityAccessNotificationViewComponent extends UserNotificationCardComponent{
    @Input() notification: EntityAccessNotification;
    @Input() permission: EntityPermission
    userPermissionDataService: UserPermissionDataService
    static parameters = [Injector];

    constructor(public injector: Injector) {
        super(injector)
        this.userPermissionDataService = this.injector.get(UserPermissionDataService)
    }

    accept() {
        combineLatest(
            this.userPermissionDataService.acceptEntityPermission(this.permission),
            this.archive()
        ).subscribe(([entityPermission]) => {
            this.notificationService.info('The invite has been successfully accepted.');
        }, err => {
            console.log(err);
            this.notificationService.error('Unable to accept the invite');
        });

        this.notificationService.info('entityAccessNotification Accepted.');
    }

    acceptAndGo() {
        this.userPermissionDataService.acceptEntityPermission(this.permission)
            .subscribe(entityPermission => {
                this.notificationService.info('The invite has been successfully accepted.');
                this.goToEntity()
            }, err => {
                console.log(err);
                this.notificationService.error('Unable to accept the invite');
            });
        this.notificationService.info('The entityAccessNotification has been acepted and now redirecting');
    }

    decline() {
        combineLatest(
            this.userPermissionDataService.declineEntityPermission(this.permission),
            this.archive()
        ).subscribe(([entityPermission]) => {
            this.notificationService.info('The invite has been successfully declined.');
        }, err => {
            console.log(err);
            this.notificationService.error('Unable to decline the invite'   );
        });
    }
}
