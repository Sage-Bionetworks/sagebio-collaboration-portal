import { Component, AfterViewInit, OnDestroy, Input } from '@angular/core';
import { EntityPermission } from 'models/auth/entity-permission.model';
import { UserPermissionDataService } from 'components/auth/user-permission-data.service';

@Component({
    selector: 'user-notification-view',
    template: require('./user-notification-view.html'),
    styles: [require('./user-notification-view.scss')]
})
export class UserNotificationViewComponent implements AfterViewInit, OnDestroy {
    @Input() invite: EntityPermission;

    static parameters = [UserPermissionDataService];
    constructor(private userPermissionDataService: UserPermissionDataService) {

    }

    ngAfterViewInit() {

    }

    ngOnDestroy() { }
}
