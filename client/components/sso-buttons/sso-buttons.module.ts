import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../components/material/material.module';
import { SSOButtonsComponent } from './sso-buttons.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MaterialModule
    ],
    declarations: [SSOButtonsComponent],
    exports: [SSOButtonsComponent]
})
export class SSOButtonsModule { }
