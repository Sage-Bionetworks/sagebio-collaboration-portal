import { AbstractControl, ValidatorFn } from '@angular/forms';


export class ObjectValidators {

    /**
     * Returns an error if the length of JSON.stringify(object) is smaller
     * than the limit specified.
     */
    static jsonStringifyMinLength(limit: Number): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const value = JSON.stringify(control.value).length;
            return value >= limit ? null : {
                'jsonStringifyMinLength': {
                    value: value,
                    limit: limit
                }
            };
        };
    }

    /**
     * Returns an error if the length of JSON.stringify(object) is larger
     * than the limit specified.
     */
    static jsonStringifyMaxLength(limit: Number): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const value = JSON.stringify(control.value).length;
            return value <= limit ? null : {
                'jsonStringifyMaxLength': {
                    value: value,
                    limit: limit
                }
            };
        };
    }
}
