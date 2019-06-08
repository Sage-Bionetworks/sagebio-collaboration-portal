import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
    name: 'lastUpdated'
})
export class LastUpdatedPipe implements PipeTransform {
    transform(isoDate: string): string {
        let date = new Date(isoDate);
        let minutes = (new Date().getTime() - date.getTime()) / 60000;
        if (minutes < 24 * 60) {
            let str = moment(date).calendar();
            return str[0].toLowerCase() + str.substr(1);
        }
        return moment(date).fromNow();
    }
}
