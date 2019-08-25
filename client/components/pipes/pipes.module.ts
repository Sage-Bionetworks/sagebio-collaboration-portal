import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateAndTimePipe } from './date/date-and-time.pipe';
import { DateLongPipe } from './date/date-long.pipe';
import { LastUpdatedPipe } from './date/last-updated.pipe';
import { SameDayPipe } from './date/same-day.pipe';
import { TakeRightPipe } from './take-right.pipe';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        DateAndTimePipe,
        DateLongPipe,
        LastUpdatedPipe,
        SameDayPipe,
        TakeRightPipe
    ],
    exports: [
        DateAndTimePipe,
        DateLongPipe,
        LastUpdatedPipe,
        SameDayPipe,
        TakeRightPipe
    ]
})
export class PipesModule { }
