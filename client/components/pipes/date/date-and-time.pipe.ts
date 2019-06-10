import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
    name: 'dateAndTime'
})
export class DateAndTimePipe implements PipeTransform {
    transform(isoDate: string): string {
        let date = new Date(isoDate);
        let currentYear = new Date().getFullYear() === date.getFullYear();
        let dateFormat = currentYear ? `MMM D` : `MMM D, YYYY`;
        return `${moment(date).format(dateFormat)} at ${moment(date).format(`LTS`)}`;
    }
}
