import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../components/material/material.module';
import { SAMLButtonsComponent } from './saml-buttons.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MaterialModule
    ],
    declarations: [SAMLButtonsComponent],
    exports: [SAMLButtonsComponent]
})
export class SAMLButtonsModule { }
