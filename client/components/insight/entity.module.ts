import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'components/material/material.module';
import { FiltersModule } from 'components/filters/filters.module';

import { EntityListComponent } from './entity-list/entity-list.component';
import { EntityViewComponent } from './entity-view/entity-view.component';

@NgModule({
    imports: [
      FormsModule,
      ReactiveFormsModule,
      MaterialModule,
      BrowserModule,
      FiltersModule,
    ],
    declarations: [
        EntityListComponent,
        EntityViewComponent,
    ],
    providers: [
    ],
    exports: [
        EntityListComponent,
    ],
    entryComponents: []
})
export class EntityModule { }
