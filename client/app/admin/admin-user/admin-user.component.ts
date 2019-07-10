import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../components/auth/user.service';
import { PageTitleService } from '../../../components/page-title/page-title.service';
import { UserPermissionService } from '../../../components/auth/user-permission.service'
import { UserPermission } from 'models/auth/user-permission.model';
import { User } from '../../../../shared/interfaces/auth/user.model'
import { permissionTypes , userRoles} from '../../../../server/config/environment/shared'
import { switchMap } from 'rxjs/operators';
import { NotificationService } from 'components/notification/notification.service';

@Component({
    selector: 'admin-user',
    template: require('./admin-user.html'),
    styles: [require('./admin-user.scss')],
})

export class AdminUserComponent implements OnInit, OnDestroy {
    private permissionOptions: String[] = permissionTypes
    private userRoles: String[] = userRoles
    private targetUser: User;
    private loggedUser: User;
    private role: String;
    private permissionsIDTracker: Object = {}
    private isAddingPermission: Object = {};

    static parameters = [Router, ActivatedRoute, PageTitleService, UserService, UserPermissionService, NotificationService];
    constructor(private router: Router,
      private route: ActivatedRoute,
      private pageTitleService: PageTitleService,
      private userService: UserService,
      private userPermissionService: UserPermissionService,
      private notificationService: NotificationService) {
      this.route.params.pipe(
        switchMap(res => this.userService.get(res.id)),
      ).subscribe(targetUser => {
        this.targetUser = targetUser;
        this.role = targetUser.role;
        this.userPermissionService.getPermissions({user: this.targetUser._id})
          .subscribe((permissionRecords: UserPermission[]) => {
            permissionRecords.map((permission: any) => {
              this.permissionsIDTracker = { ...this.permissionsIDTracker, [permission.permission]: permission._id  }
              this.isAddingPermission = { ...this.isAddingPermission, [permission.permission]: true }
            })
          }, err => console.log('ERROR', err));
      });
      this.userService.get()
        .subscribe(loggedUser => {
          this.loggedUser = loggedUser
        })
    }

    ngOnInit() {
      this.pageTitleService.title = 'Admin User';
    }

    onChangePermissionCheckbox(permissionOption: any) {
      if (this.isAddingPermission[permissionOption]) {
        const body = { user: this.targetUser._id, permission: permissionOption, createdBy: this.loggedUser._id }
        this.userPermissionService.addPermissions(body)
          .subscribe((addedRecord: any) => {
            this.updatePermissionsIDTracker(permissionOption, addedRecord);
            this.notificationService.info('Permission Successfully Updated');
          })
      } else {
        const entityID = this.permissionsIDTracker[permissionOption]
        this.userPermissionService.deletePermissions(entityID)
          .subscribe(() => {
            this.notificationService.info('Permission Successfully Removed');
          })
      }
    }

    // updatePermissionsIDTracker(isAdding: boolean, permissionOption: any, addedRecord: any) {
    //   if (isAdding) {
    //     if (this.permissionsIDTracker[permissionOption]) {
    //       this.permissionsIDTracker[permissionOption] = addedRecord._id
    //     } else {
    //       this.permissionsIDTracker = { ...this.permissionsIDTracker, [permissionOption]: addedRecord._id }
    //     }
    //   } else {
    //     // lodash
    //     delete this.permissionsIDTracker[permissionOption]
    //   }
    // }

    updatePermissionsIDTracker(permissionOption: any, addedRecord: any) {
      if (this.permissionsIDTracker[permissionOption]) {
        this.permissionsIDTracker[permissionOption] = addedRecord._id
      } else {
        this.permissionsIDTracker = { ...this.permissionsIDTracker, [permissionOption]: addedRecord._id }
      }
    }

    onChangeRole() {
      this.userService.changeRole(this.targetUser._id, this.role)
        .subscribe(() => {
          this.notificationService.info('Role Successfully Updated');
        })
    }

    ngOnDestroy() { }
}
