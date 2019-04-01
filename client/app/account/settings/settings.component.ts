import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../components/auth/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PasswordValidation } from '../../../components/validation/password-validation';
import { PageTitleService } from '../../../components/page-title/page-title.service';
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'settings',
    template: require('./settings.html'),
    styles: [require('./settings.scss')]
})
export class SettingsComponent implements OnInit {
    changePasswordForm: FormGroup;
    submitted = false;

    static parameters = [AuthService, FormBuilder, MatSnackBar, PageTitleService];
    constructor(private authService: AuthService, private formBuilder: FormBuilder,
        private snackBar: MatSnackBar, private pageTitleService: PageTitleService) {
        this.changePasswordForm = this.formBuilder.group({
            oldPassword: ['', [
                Validators.required,
            ]],
            newPasswordGroup: formBuilder.group({
                password: ['', [
                    Validators.required,
                ]],
                confirmPassword: ['', [
                    Validators.required,
                ]],
            }, { validator: PasswordValidation.matchPassword })
        });
    }

    ngOnInit() {
        this.pageTitleService.title = 'Settings';
    }

    changePassword(): void {
        if (this.changePasswordForm.invalid) {
            return;
        }
        this.submitted = true;

        let values = this.changePasswordForm.value;
        this.authService.changePassword(values.oldPassword, values.newPasswordGroup.password)
            .subscribe(() => {
                this.snackBar.open('Password successfully changed', undefined, {
                    duration: 2000
                });
            }, err => {
                this.changePasswordForm.controls.oldPassword.setErrors({ incorrect: true });
            });
    }
}
