import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'models/auth/user.model';
import { AuthService } from '../auth/auth.service';
import config from '../../app/app.constants';

@Component({
    selector: 'navbar-user-button',
    template: require('./navbar-user-button.html'),
    styles: [require('./navbar-user-button.scss')]
})
export class NavbarUserButton implements OnInit, OnDestroy {
    private currentUser: User;
    private isLoggedIn = false;
    // private isAdmin = false;
    private authInfoSub: Subscription;
    private avatarSize = 40;

    static parameters = [Router, AuthService];
    constructor(private router: Router, private authService: AuthService) { }

    ngOnInit() {
        this.authInfoSub = this.authService.authInfo()
            .subscribe(authInfo => {
                this.currentUser = authInfo.user;
                this.isLoggedIn = authInfo.isLoggedIn();
                // this.isAdmin = authInfo.isAdmin();
            }, err => console.log(err));

        this.avatarSize = config.avatar.size.small;
    }

    ngOnDestroy() {
        this.authInfoSub.unsubscribe();
    }

    logout(): void {
        this.authService.logout()
            .subscribe(() => {
                this.router.navigateByUrl('');
            }, err => console.log(err));
    }
}
