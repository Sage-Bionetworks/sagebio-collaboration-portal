import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
    name: 'dateLong'
})
export class DateLongPipe implements PipeTransform {
    transform(isoDate: string): string {
        let date = new Date(isoDate);
        let currentYear = new Date().getFullYear() === date.getFullYear();
        let format = currentYear ? 'dddd, MMMM Do' : 'dddd, MMMM Do, YYYY';
        return moment(date).format(format);
    }
}
