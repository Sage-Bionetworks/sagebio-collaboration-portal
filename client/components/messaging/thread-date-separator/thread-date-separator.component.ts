import { Component, Input } from '@angular/core';
import { DateLongPipe } from '../../pipes/date/date-long.pipe';

@Component({
    selector: 'thread-date-separator',
    template: require('./thread-date-separator.html'),
    styles: [require('./thread-date-separator.scss')],
})
export class ThreadDateSeparatorComponent {
    @Input('isoDate') private isoDate: string;

    static parameters = [];
    constructor() { }
}
