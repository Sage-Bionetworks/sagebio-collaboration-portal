import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'components/material/material.module';
import { AppQuillModule } from 'components/quill/app-quill.module';
import { ProvenanceService } from 'components/provenance/provenance.service';
import { ProvenanceModule } from 'components/provenance/provenance.module';
import { DirectivesModule } from 'components/directives/directives.module';
import { FiltersModule } from 'components/filters/filters.module';
import { ActivityNewComponent } from './activity-new/activity-new.component';
import { ActivitySidenavComponent } from './activity-sidenav/activity-sidenav.component';
import { ShowActivityButtonComponent } from './show-activity-button/show-activity-button.component';
import { ActivityService } from './activity.service';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        AppQuillModule,
        CommonModule,
        FiltersModule,
        ProvenanceModule,
        RouterModule,
        DirectivesModule
    ],
    declarations: [
        ActivitySidenavComponent,
        ShowActivityButtonComponent,
        ActivityNewComponent
    ],
    providers: [
        ActivityService,
        ProvenanceService
    ],
    exports: [
        ActivitySidenavComponent,
        ShowActivityButtonComponent,
        ActivityNewComponent
    ],
    entryComponents: []
})
export class ActivityModule { }
