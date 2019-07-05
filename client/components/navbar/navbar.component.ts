import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
// import { filter } from 'lodash';
import { AuthService } from '../auth/auth.service';
import { UserPermissionDataService, UserPermissions } from '../auth/user-permission-data.service';
// import { InvitesService } from '../invite/invites.service';
// import { SidenavService } from '../sidenav/sidenav.service';
import { PageTitleService } from '../page-title/page-title.service';
import { NavbarUserButton } from '../navbar-user-button/navbar-user-button.component';
// import { AppImagePipe } from '../image/image.pipe';
import { SecondarySidenavService } from '../sidenav/secondary-sidenav/secondary-sidenav.service';

@Component({
    selector: 'app-navbar',
    template: require('./navbar.html'),
    styles: [require('./navbar.scss')]
})
export class NavbarComponent {
    private userPermissions: Observable<UserPermissions>;

    isCollapsed = true;
    // menu = [{
    //   title: 'Home',
    //   'link': '/home',
    // }, {
    //   title: 'Games',
    //   'link': '/games'
    // }];
    private currentUser = undefined;
    private isLoggedIn = false;
    private isAdmin = false;

    private instanceTitle = 'Instances';

    private authInfoSub: Subscription;
    private userPermissionsSub: Subscription;
    private invitesSub: Subscription;

    static parameters = [AuthService, UserPermissionDataService, Router,
        PageTitleService, SecondarySidenavService];
    constructor(private authService: AuthService,
        private userPermissionDataService: UserPermissionDataService,
        private router: Router, private pageTitleService: PageTitleService,
        private secondarySidenavService: SecondarySidenavService) {
        this.authInfoSub = this.authService.authInfo()
            .subscribe(authInfo => {
                console.log('NAVBAR AUTH INFO', authInfo);
                this.currentUser = authInfo.user;
                this.isLoggedIn = authInfo.isLoggedIn();
            });

        this.userPermissionsSub = this.userPermissionDataService.getPermissions()
            .subscribe(userPermissions => {
                this.isAdmin = userPermissions.isAdmin();
            }, err => console.log(err));
    }

    ngOnDestroy() {
        this.authInfoSub.unsubscribe();
        this.userPermissionsSub.unsubscribe();
    }

    logout() {
        this.authService.logout().subscribe(() => {
            this.secondarySidenavService.close();
            this.router.navigateByUrl('');
        }, err => console.log(err));
    }
}
