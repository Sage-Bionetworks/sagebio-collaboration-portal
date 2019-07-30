import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { AuthService } from 'components/auth/auth.service';
import { PageTitleService } from 'components/page-title/page-title.service';
import { SSOButtonsComponent } from 'components/sso-buttons/sso-buttons.component';
import { NotificationService } from 'components/notification/notification.service';
import config from '../../app.constants';

@Component({
    selector: 'login',
    template: require('./login.html'),
    styles: [require('./login.scss')]
})
export class LoginComponent implements OnInit {
    private authStrategies: Observable<string[]>;
    loginForm: FormGroup;
    errors = {
        login: undefined
    };
    private contactUsUrl = '';

    static parameters = [AuthService, Router, ActivatedRoute, FormBuilder,
        PageTitleService, NotificationService];
    constructor(private authService: AuthService, private router: Router,
        private route: ActivatedRoute, formBuilder: FormBuilder,
        private pageTitleService: PageTitleService,
        private notificationService: NotificationService) {

        // Login callback
        this.route.queryParams.subscribe(res => {
            if (res.message) {
                this.notificationService.info(res.message);
            }
            if (res.token && res.expiresIn) {
                authService.loginWithTokenResponse({
                    token: res.token,
                    expiresIn: res.expiresIn
                }).subscribe(user => {
                    this.router.navigate([this.authService.getRedirectUrl()]);
                }, err => {
                    console.log(err);
                });
            }
        });

        this.loginForm = formBuilder.group({
            email: ['', [
                Validators.required,
                Validators.email
            ]],
            password: ['', [
                Validators.required,
            ]]
        });

        this.contactUsUrl = config.contactUsUrl;
    }

    ngOnInit() {
        this.authStrategies = this.authService.getAuthStrategies()
            .pipe(share());
        this.pageTitleService.title = 'Login';
    }

    login(): void {
        let values = this.loginForm.value;
        this.authService.login({
            email: values.email,
            password: values.password
        }).subscribe(user => {
            this.router.navigate([this.authService.getRedirectUrl()]);
            this.authService.resetRedirectUrl();
        }, err => {
            console.log(err);
            this.notificationService.info(err.message || err);
            // if (err.field === 'email') {
            //     this.loginForm.controls.email.setErrors({ unknownEmail: true });
            // } else if (err.field === 'password') {
            //     this.loginForm.controls.password.setErrors({ incorrect: true });
            // } else {
            //     this.errors.login = err.message || err;
            //     console.log(this.errors);
            // }
        });
    }
}
