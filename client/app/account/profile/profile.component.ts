import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
// import { Observable, BehaviorSubject, Subscription, from, forkJoin } from 'rxjs';
import { MatSliderChange } from '@angular/material';
import { AuthService } from 'components/auth/auth.service';
import { UserService } from 'components/auth/user.service';
import { UserPermissionDataService, UserPermissions } from 'components/auth/user-permission-data.service';
import { PageTitleService } from 'components/page-title/page-title.service';
import { Subject, forkJoin, Subscription, Observable } from 'rxjs';
import { tap, switchMap, map, last } from 'rxjs/operators';
import { HttpEventType } from '@angular/common/http';
import { User } from 'models/auth/user.model';
import { UserPermission } from 'models/auth/user-permission.model';
import { NotificationService } from 'components/notification/notification.service';

@Component({
    selector: 'profile',
    template: require('./profile.html'),
    styles: [require('./profile.scss')],
    encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit, OnDestroy {
    currentUser: User;
    authInfoSub: Subscription;
    private permissions: Observable<UserPermissions>;

    static parameters = [AuthService, UserService, PageTitleService, UserPermissionDataService];
    constructor(private authService: AuthService, private userService: UserService,
        private pageTitleService: PageTitleService,
        private userPermissionDataService: UserPermissionDataService) {
        this.authInfoSub = this.authService.authInfo()
            .subscribe(authInfo => {
                this.currentUser = authInfo.user;
            });
        this.permissions = this.userPermissionDataService.getPermissions();
    }

    ngOnInit() {
        this.pageTitleService.title = 'Profile';
    }

    ngOnDestroy() {
        this.authInfoSub.unsubscribe();
    }
}
