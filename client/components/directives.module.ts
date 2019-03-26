import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MaterialModule } from './material/material.module';

import { CollapseModule } from 'ngx-bootstrap';

import { AuthModule } from './auth/auth.module';

import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { OauthButtonsComponent } from './oauth-buttons/oauth-buttons.component';

@NgModule({
    imports: [
        CommonModule,
        CollapseModule,
        AuthModule,
        MaterialModule,

        RouterModule,
    ],
    declarations: [
        NavbarComponent,
        FooterComponent,
        OauthButtonsComponent,
    ],
    exports: [
        NavbarComponent,
        FooterComponent,
        OauthButtonsComponent,
    ]
})
export class DirectivesModule { }
