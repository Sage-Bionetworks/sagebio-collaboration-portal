import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../components/auth/user.service';
import { PageTitleService } from '../../../components/page-title/page-title.service';
import { UserPermissionService } from '../../../components/auth/user-permission.service'
import { UserPermission } from 'models/auth/user-permission.model';
import { User } from '../../../../shared/interfaces/auth/user.model'
import { permissionTypes , userRoles} from '../../../../server/config/environment/shared'
import { switchMap } from 'rxjs/operators';
// import config from '../../../app/app.constants';


@Component({
    selector: 'admin-user',
    template: require('./admin-user.html'),
    styles: [require('./admin-user.scss')],
})

export class AdminUserComponent implements OnInit, OnDestroy {
    private permissionOptions: String[] = permissionTypes
    private userRoles: String[] = userRoles
    private user: User;
    private loggedUser: User;
    private initialRole: String;
    private role: String;
    private permissionsStateDetails: Object = {}
    private checkboxPermissionValues: Object = {}

    static parameters = [Router, ActivatedRoute, PageTitleService, UserService, UserPermissionService];
    constructor(private router: Router,
      private route: ActivatedRoute,
      private pageTitleService: PageTitleService,
      private userService: UserService,
      private userPermissionService: UserPermissionService) {
      this.route.params.pipe(
        switchMap(res => this.userService.get(res.id)),
      ).subscribe(targetUser => {
        this.user = targetUser;
        this.initialRole = targetUser.role;
        this.role = this.initialRole
        this.userPermissionService.getPermissions({user: this.user._id})
          .subscribe((permissionRecords: UserPermission[]) => {
            permissionRecords.map((permission: any) => {
              this.permissionsStateDetails = { ...this.permissionsStateDetails, ... { [permission.permission]: { value: true, id: permission._id } } }
              this.checkboxPermissionValues = { ...this.checkboxPermissionValues, [permission.permission]: true }
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

    onChangeCheckbox(permissionOption: any) {
      const isAddition = this.checkboxPermissionValues[permissionOption]
      if (isAddition) {
        const body = { user: this.user._id, permission: permissionOption, createdBy: this.loggedUser._id }
        this.userPermissionService.addPermissions(body)
          .subscribe((addedRecord: any) => {
            this.permissionsStateDetails[permissionOption].id = addedRecord._id
            // TODO NOTIFICATION
          })
      } else {
        const entityID = this.permissionsStateDetails[permissionOption].id
        this.userPermissionService.deletePermissions(entityID)
          .subscribe(() => {
            // TODO NOTIFICATION
          })
      }
    }

    onChangeRole() {
      console.log('onChangeRole: ');
    }

    ngOnDestroy() { }
}
