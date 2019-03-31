import { AbstractControl } from '@angular/forms';

export class PasswordValidation {

    // See https://scotch.io/@ibrahimalsurkhi/match-password-validation-with-angular-2
    static matchPassword(AC: AbstractControl) {
        let password = AC.get('password').value; // to get value in input tag
        let confirmPassword = AC.get('confirmPassword').value; // to get value in input tag
        if (password !== confirmPassword) {
            AC.get('confirmPassword').setErrors({ matchPassword: true });
        } else {
            return null;
        }
    }
}
