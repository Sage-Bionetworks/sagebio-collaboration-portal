import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'components/material/material.module';
import { ButtonToggleFilterComponent } from './button-toggle-filter/button-toggle-filter.component';
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
        ButtonToggleFilterComponent,
        RadioButtonFilterComponent,
        SearchFilterComponent,
        SelectFilterComponent
    ],
    exports: [
        ButtonToggleFilterComponent,
        RadioButtonFilterComponent,
        SearchFilterComponent,
        SelectFilterComponent
    ]
})
export class FiltersModule { }
