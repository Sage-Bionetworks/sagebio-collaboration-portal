import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
// import { filter } from 'lodash';
import { AuthService } from '../auth/auth.service';
// import { InvitesService } from '../invite/invites.service';
// import { SidenavService } from '../sidenav/sidenav.service';
import { PageTitleService } from '../page-title/page-title.service';
import { NavbarUserButton } from '../navbar-user-button/navbar-user-button.component';
// import { AppImagePipe } from '../image/image.pipe';

@Component({
    selector: 'app-navbar',
    template: require('./navbar.html'),
    styles: [require('./navbar.scss')]
})
export class NavbarComponent {
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
    private invitesSub: Subscription;

    static parameters = [AuthService, Router, PageTitleService];
    constructor(private authService: AuthService, private router: Router,
        private pageTitleService: PageTitleService) {
        this.authInfoSub = this.authService.authInfo()
            .subscribe(authInfo => {
                this.currentUser = authInfo.user;
                this.isLoggedIn = authInfo.isLoggedIn();
                this.isAdmin = authInfo.isAdmin();
            });
    }

    ngOnDestroy() {
        this.authInfoSub.unsubscribe();
    }

    logout() {
        this.authService.logout().subscribe(() => {
            this.router.navigateByUrl('');
        }, err => console.log(err));
    }
}
