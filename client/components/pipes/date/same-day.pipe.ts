import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
    name: 'sameDay'
})
export class SameDayPipe implements PipeTransform {
    transform(isoDate: string, isoDate2: string): boolean {
        let a = moment(isoDate, 'DD-MM-YYYY');
        let b = moment(isoDate2, 'DD-MM-YYYY');
        return a.isSame(b);
    }
}
