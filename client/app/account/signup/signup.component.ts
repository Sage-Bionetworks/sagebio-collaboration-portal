import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'components/auth/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PasswordValidation } from 'components/validation/password-validation';
import { PageTitleService } from 'components/page-title/page-title.service';

@Component({
    selector: 'signup',
    template: require('./signup.html'),
    styles: [require('./signup.scss')]
})
export class SignupComponent implements OnInit {
    userRegistrationForm: FormGroup;
    errors = {
        email: undefined,
        other: undefined
    };
    submitted = false;

    static parameters = [AuthService, Router, FormBuilder, PageTitleService];
    constructor(private authService: AuthService, private router: Router,
        private formBuilder: FormBuilder, private pageTitleService: PageTitleService) {
        this.userRegistrationForm = this.formBuilder.group({
            name: ['plop', [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(128)
            ]],
            email: ['plop@plop.ch', [
                Validators.required,
                Validators.email
            ]],
            passwordGroup: formBuilder.group({
                password: ['plop', [
                    Validators.required,
                ]],
                confirmPassword: ['plop', [
                    Validators.required,
                ]],
            }, { validator: PasswordValidation.matchPassword })
        });
    }

    ngOnInit() {
        this.pageTitleService.setTitle('Sign up');
    }

    register(): void {
        if (this.userRegistrationForm.invalid) {
            return;
        }
        this.submitted = true;

        this.errors.other = undefined;
        let values = this.userRegistrationForm.value;
        this.authService.createUser({
            name: values.name,
            email: values.email,
            password: values.passwordGroup.password
        }).subscribe(() => {
            // Account created, redirect to home
            this.router.navigateByUrl('/home');
        }, err => {
            if (err.errors.email) { // mongoose error;
                this.errors.email = err.errors.email.message;
                this.userRegistrationForm.controls.email.setErrors({ serverError: true });
            } else {
                this.errors.other = err;
            }
        });
    }
}
