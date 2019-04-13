import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MaterialModule } from './material/material.module';

import { AuthModule } from './auth/auth.module';
import { NavbarModule } from './navbar/navbar.module';
import { NavbarUserButtonModule } from './navbar-user-button/navbar-user-button.module';
import { FooterModule } from './footer/footer.module';
import { OAuthButtonsModule } from './oauth-buttons/oauth-buttons.module';

import { PageTitleService } from './page-title/page-title.service';
import { FiltersModule } from './filters/filters.module';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        AuthModule,
        NavbarModule,
        NavbarUserButtonModule,
        FooterModule,
        OAuthButtonsModule,

        RouterModule,
    ],
    providers: [
        PageTitleService
    ],
    declarations: [
        // OauthButtonsComponent,
    ],
    exports: [
        NavbarModule,
        NavbarUserButtonModule,
        FooterModule,
        OAuthButtonsModule,
        FiltersModule
    ]
})
export class DirectivesModule { }
