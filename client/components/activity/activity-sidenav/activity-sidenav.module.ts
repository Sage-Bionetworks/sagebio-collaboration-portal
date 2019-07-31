import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'components/material/material.module';
import { ActivitySidenavComponent } from './activity-sidenav.component';
import { FiltersModule } from 'components/filters/filters.module';
import { ProvenanceModule } from 'components/provenance/provenance.module';

@NgModule({
    imports: [
        MaterialModule,
        CommonModule,
        FiltersModule,
        ProvenanceModule
    ],
    declarations: [ActivitySidenavComponent],
    exports: [ActivitySidenavComponent]
})
export class ActivitySidenavModule { }
