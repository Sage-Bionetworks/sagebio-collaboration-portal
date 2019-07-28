import { NgModule } from '@angular/core';
import { MaterialModule } from 'components/material/material.module';
import { ActivitySidenavComponent } from './activity-sidenav.component';
import { FiltersModule } from 'components/filters/filters.module';

@NgModule({
    imports: [
        MaterialModule,
        FiltersModule
    ],
    declarations: [ActivitySidenavComponent],
    exports: [ActivitySidenavComponent]
})
export class ActivitySidenavModule { }
