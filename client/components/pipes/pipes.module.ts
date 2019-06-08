import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateAndTimePipe } from './date/date-and-time.pipe';
import { DateLongPipe } from './date/date-long.pipe';
import { SameDayPipe } from './date/same-day.pipe';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        DateAndTimePipe,
        DateLongPipe,
        SameDayPipe
    ],
    exports: [
        DateAndTimePipe,
        DateLongPipe,
        SameDayPipe
    ]
})
export class PipesModule { }
