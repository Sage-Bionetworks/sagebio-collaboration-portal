import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../components/auth/user.service';
// import { PageTitleService } from '../../../components/page-title/page-title.service';
import { User } from '../../../../shared/interfaces/user.model';
import { UserPermissionDataService, UserPermissions } from '../../../components/auth/user-permission-data.service';
// import { Observable } from 'rxjs';
import { merge } from 'lodash/fp';


import { switchMap } from 'rxjs/operators';
// import config from '../../../app/app.constants';


@Component({
    selector: 'admin-user',
    template: require('./admin-user.html'),
    styles: [require('./admin-user.scss')],
})
export class AdminUserComponent implements OnInit, OnDestroy {
    private user: User;

    private initialRole: String
    private role: String;

    private initialCanCreateTool: Boolean
    private canCreateTool: Boolean

    private initialCanEditTool: Boolean
    private canEditTool: Boolean

    private initialCanDeleteTool: Boolean
    private canDeleteTool: Boolean

    private initialReactivateUser: Boolean
    private reactivateUser: Boolean

    private initialDeactivateUser: Boolean
    private deactivateUser: Boolean

    private permissionChanges: Array<Object> = []
    private permissionOptions: String[] = ['canCreateTool', 'canEditTool', 'canDeleteTool', 'reactivateUser', 'deactivateUser']

    static parameters = [Router, ActivatedRoute, UserService, UserPermissionDataService];
    constructor(private router: Router,
      private route: ActivatedRoute,
      private userService: UserService,
      private userPermissionDataService: UserPermissionDataService) {
        this.userPermissionDataService.getPermissions()
          .subscribe((permissions: UserPermissions) => {
            this.setPermissionsState(permissions)
          }, err => console.log('ERROR', err));

        const user$ = this.route.params.pipe(
          switchMap(res => this.userService.get(res.id))
        )

        user$
          .subscribe(user => {
            this.user = user;
            this.initialRole = user.role;
            this.role = this.initialRole
          });
      }

    setPermissionsState(permissions: UserPermissions) {
      this.canCreateTool = permissions.canCreateTool();
      this.initialCanCreateTool = this.canCreateTool;
      this.canEditTool = permissions.canEditTool();
      this.initialCanEditTool = this.canEditTool;
      this.initialCanDeleteTool = permissions.canDeleteTool();
      this.canDeleteTool = this.initialCanDeleteTool;
      this.initialReactivateUser = false;
      this.reactivateUser = this.initialReactivateUser;
      this.initialDeactivateUser = false;
      this.deactivateUser = this.initialDeactivateUser;
    }


    ngOnInit() { }

    SavePermissions() {
      console.log('Into SavePermissions: ');
      this.getChangesInPermissions()
    }

    getChangesInPermissions() {
      if (this.initialCanCreateTool !== this.canCreateTool) {
        this.permissionChanges.push({ canCreateTool: this.canCreateTool })
      }
      if (this.initialCanEditTool !== this.canEditTool) {
        this.permissionChanges.push({ canEditTool: this.canEditTool })
      }
      if (this.initialCanDeleteTool !== this.canDeleteTool) {
        this.permissionChanges.push({ canDeleteTool: this.canDeleteTool })
      }
      if (this.initialReactivateUser !== this.reactivateUser) {
        this.permissionChanges.push({ reactivateUser: this.reactivateUser })
      }
      if (this.initialDeactivateUser !== this.deactivateUser) {
        this.permissionChanges.push({ deactivateUser: this.deactivateUser })
      }
      return this.permissionChanges)
    }

    cancelChanges() {
      console.log('cancelChange: ');
      this.canCreateTool = this.initialCanCreateTool
      this.canEditTool = this.initialCanEditTool
      this.canDeleteTool = this.initialCanDeleteTool
      this.reactivateUser = this.initialReactivateUser
      this.deactivateUser = this.initialDeactivateUser
      this.permissionChanges = []
    }

    ngOnDestroy() { }

    // deleteUser(user) {
    //     this.userService.remove(user).subscribe(deletedUser => {
    //         this.users.splice(this.users.indexOf(deletedUser), 1);
    //     });
    // }
}
