import { Component, Input } from '@angular/core';
import { DateLongPipe } from '../../pipes/date/date-long.pipe';

@Component({
    selector: 'message-date-separator',
    template: require('./message-date-separator.html'),
    styles: [require('./message-date-separator.scss')],
})
export class MessageDateSeparatorComponent {
    @Input('isoDate') private isoDate: string;

    static parameters = [];
    constructor() { }
}
