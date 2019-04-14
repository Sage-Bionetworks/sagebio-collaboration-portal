import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../components/auth/auth.service';
import { PageTitleService } from '../../../components/page-title/page-title.service';
import { OAuthButtonsComponent } from '../../../components/oauth-buttons/oauth-buttons.component';
// import { has } from 'lodash/fp';

@Component({
    selector: 'login',
    template: require('./login.html'),
    styles: [require('./login.scss')]
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    errors = {
        login: undefined
    };
    submitted = false;

    static parameters = [AuthService, Router, ActivatedRoute, FormBuilder, PageTitleService];
    constructor(private authService: AuthService, private router: Router,
        private route: ActivatedRoute, formBuilder: FormBuilder,
        private pageTitleService: PageTitleService) {

        // OAuth login callback
        this.route.queryParams.subscribe(res => {
            if (res.token && res.expiresIn) {
                authService.loginWithTokenResponse({
                    token: res.token,
                    expiresIn: res.expiresIn
                }).subscribe(user => {
                    this.router.navigateByUrl('');
                }, err => {
                    console.log('ERROR', err);
                });
            }
        });

        this.loginForm = formBuilder.group({
            email: ['admin@example.com', [
                Validators.required,
                Validators.email
            ]],
            password: ['admin', [
                Validators.required,
            ]]
        });
    }

    ngOnInit() {
        this.pageTitleService.title = 'Login';
    }

    login(): void {
        this.submitted = true;

        let values = this.loginForm.value;
        this.authService.login({
            email: values.email,
            password: values.password
        }).subscribe(user => {
            // Logged in, redirect to home
            this.router.navigateByUrl('');
        }, err => {
            console.log('ERROR', err);
            if (err.field === 'email') {
                this.loginForm.controls.email.setErrors({ unknownEmail: true });
            } else if (err.field === 'password') {
                this.loginForm.controls.password.setErrors({ incorrect: true });
            } else {
                this.errors.login = err.message;
                console.log(this.errors);
            }
        });
    }

    // TODO: For development only
    loginAs(email): void {
        this.loginForm.setValue({ email, password: 'test' });
        this.login();
    }

    goToPasswordRecovery(): void {
        console.log('Password recovery (not implemented)');
    }
}
