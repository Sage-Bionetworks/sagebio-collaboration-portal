import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeasurableDirective } from './measurable.directive';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        MeasurableDirective
    ],
    exports: [
        MeasurableDirective
    ]
})
export class DirectivesModule { }
