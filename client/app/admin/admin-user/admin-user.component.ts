import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'components/auth/user.service';
import { PageTitleService } from 'components/page-title/page-title.service';
import { ActionPermissionService } from 'components/auth/action-permission.service';
import { ActionPermission } from 'models/auth/action-permission.model';
import { User } from 'models/auth/user.model';
import { actionPermissionTypes, userRoles } from '../../../../server/config/environment/shared';  // MUST NOT REFER TO SERVER
import { switchMap } from 'rxjs/operators';
import { NotificationService } from 'components/notification/notification.service';
import { omit } from 'lodash';

const USER_ROLES = Object.values(userRoles).map(role => role.value);

@Component({
    selector: 'admin-user',
    template: require('./admin-user.html'),
    styles: [require('./admin-user.scss')],
})

export class AdminUserComponent implements OnInit, OnDestroy {
    private permissionOptions: String[] = Object.values(actionPermissionTypes).map(action => action.value);
    private userRoles: String[] = USER_ROLES;
    private targetUser: User;
    private loggedUser: User;
    private role: String;
    private permissionsIDTracker: Object = {};
    private isAddingPermission: Object = {};

    static parameters = [Router, ActivatedRoute, PageTitleService, UserService, ActionPermissionService, NotificationService];
    constructor(private router: Router,
        private route: ActivatedRoute,
        private pageTitleService: PageTitleService,
        private userService: UserService,
        private actionPermissionService: ActionPermissionService,
        private notificationService: NotificationService) {
        this.route.params.pipe(
            switchMap(res => this.userService.get(res.id)),
        ).subscribe(targetUser => {
            this.targetUser = targetUser;
            this.role = targetUser.role;
            this.actionPermissionService.indexByUser(this.targetUser._id)
                .subscribe((permissionRecords: ActionPermission[]) => {
                    permissionRecords.map((permission: any) => {
                        this.permissionsIDTracker = { ...this.permissionsIDTracker, [permission.permission]: permission._id };
                        this.isAddingPermission = { ...this.isAddingPermission, [permission.permission]: true };
                    });
                }, err => console.log('ERROR', err));
        });
        this.userService.get()
            .subscribe(loggedUser => {
                this.loggedUser = loggedUser;
            });
    }

    ngOnInit() {
        this.pageTitleService.title = 'Admin User';
    }

    onChangePermissionCheckbox(permissionOption: any) {
        // if (this.isAddingPermission[permissionOption]) {
        //     const body = { user: this.targetUser._id, permission: permissionOption, createdBy: this.loggedUser._id };
        //     this.actionPermissionService.addPermissions(body)
        //         .subscribe((addedRecord: any) => {
        //             this.updatePermissionsIDTracker(true, permissionOption, addedRecord);
        //             this.notificationService.info('Permission Successfully Updated');
        //         });
        // } else {
        //     const entityID = this.permissionsIDTracker[permissionOption];
        //     this.actionPermissionService.deletePermissions(entityID)
        //         .subscribe(() => {
        //             this.updatePermissionsIDTracker(false, permissionOption, null);
        //             this.notificationService.info('Permission Successfully Removed');
        //         });
        // }
    }

    updatePermissionsIDTracker(isAddingPermission: boolean, permissionOption: any, addedRecord: any) {
        if (isAddingPermission) {
            this.permissionsIDTracker = { ...this.permissionsIDTracker, [permissionOption]: addedRecord._id };
        } else {
            this.permissionsIDTracker = omit(this.permissionsIDTracker, [permissionOption]);
        }
    }

    onChangeRole() {
        this.userService.changeRole(this.targetUser._id, this.role)
            .subscribe(() => {
                this.notificationService.info('Role Successfully Updated');
            });
    }

    ngOnDestroy() { }
}
