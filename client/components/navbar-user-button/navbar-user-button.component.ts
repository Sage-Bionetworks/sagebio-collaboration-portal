import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../../../shared/interfaces/user.model';
import { AuthService } from '../auth/auth.service';
// import { ImagePipe, WebpPipe } from '../image/image.pipe';

@Component({
    selector: 'navbar-user-button',
    template: require('./navbar-user-button.html'),
    styles: [require('./navbar-user-button.scss')]
})
export class NavbarUserButton implements OnInit, OnDestroy {
    private currentUser: User;
    private isLoggedIn = false;
    private isAdmin = false;
    private authInfoSub: Subscription;

    static parameters = [Router, AuthService];
    constructor(private router: Router, private authService: AuthService) { }

    ngOnInit() {
        this.authInfoSub = this.authService.authInfo()
            .subscribe(authInfo => {
                this.currentUser = authInfo.user;
                this.isLoggedIn = authInfo.isLoggedIn();
                this.isAdmin = authInfo.isAdmin();
            }, err => console.log(err));
    }

    ngOnDestroy() {
        this.authInfoSub.unsubscribe();
    }

    logout(): void {
        this.authService.logout().subscribe(() => {
            this.router.navigateByUrl('');
        }, err => console.log(err));
    }
}
