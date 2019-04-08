import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../components/material/material.module';
import { OAuthButtonsComponent } from './oauth-buttons.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MaterialModule
    ],
    declarations: [OAuthButtonsComponent],
    exports: [OAuthButtonsComponent]
})
export class OAuthButtonsModule { }
