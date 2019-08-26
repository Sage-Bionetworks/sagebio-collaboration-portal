import { Pipe, PipeTransform } from '@angular/core';
import { take } from 'lodash/fp';

@Pipe({
    name: 'take'
})
export class TakePipe implements PipeTransform {
    transform(items: any[], n = 1): any[] {
        return take(n, items);
    }
}
