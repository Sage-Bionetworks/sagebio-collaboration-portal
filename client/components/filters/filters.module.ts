import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'components/material/material.module';
import { RadioButtonFilterComponent } from './radio-button-filter/radio-button-filter.component';
import { SearchFilterComponent } from './search-filter/search-filter.component';
import { SelectFilterComponent } from './select-filter/select-filter.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MaterialModule
    ],
    declarations: [
        RadioButtonFilterComponent,
        SearchFilterComponent,
        SelectFilterComponent
    ],
    exports: [
        RadioButtonFilterComponent,
        SearchFilterComponent,
        SelectFilterComponent
    ]
})
export class FiltersModule { }
