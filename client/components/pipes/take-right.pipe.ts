import { Pipe, PipeTransform } from '@angular/core';
import { takeRight } from 'lodash/fp';

@Pipe({
    name: 'takeRight'
})
export class TakeRightPipe implements PipeTransform {
    transform(items: any[], n = 1): any[] {
        return takeRight(n, items);
    }
}
