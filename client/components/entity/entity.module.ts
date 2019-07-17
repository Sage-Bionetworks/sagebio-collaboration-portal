import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'components/material/material.module';
import { EntityAccessListComponent } from './entity-access-list/entity-access-list.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule
    ],
    declarations: [EntityAccessListComponent],
    exports: [EntityAccessListComponent]
})
export class EntityModule { }
