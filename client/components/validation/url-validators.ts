import { AbstractControl, ValidatorFn } from '@angular/forms';


export class UrlValidators {

    /**
     * Returns an error if the url has a trailing slash.
     */
    static noTrailingSlash(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            return control.value.endsWith('/') ? { noTrailingSlash: true } : null;
        };
    }

    /**
     * Returns an error if the url does not specify the https:// protocol.
     */
    static https(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            return control.value.startsWith('https://') ? null : { https: true };
        };
    }
}
