import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MaterialModule } from './material/material.module';

import { CollapseModule } from 'ngx-bootstrap';

import { AuthModule } from './auth/auth.module';
import { NavbarModule } from './navbar/navbar.module';

import { FooterComponent } from './footer/footer.component';
import { OauthButtonsComponent } from './oauth-buttons/oauth-buttons.component';

@NgModule({
    imports: [
        CommonModule,
        CollapseModule,
        MaterialModule,
        AuthModule,
        NavbarModule,

        RouterModule,
    ],
    declarations: [
        FooterComponent,
        OauthButtonsComponent,
    ],
    exports: [
        NavbarModule,
        FooterComponent,
        OauthButtonsComponent,
    ]
})
export class DirectivesModule { }
