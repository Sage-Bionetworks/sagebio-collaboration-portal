import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MaterialModule } from './material/material.module';

import { AuthModule } from './auth/auth.module';
import { NavbarModule } from './navbar/navbar.module';
import { NavbarUserButtonModule } from './navbar-user-button/navbar-user-button.module';
import { FooterModule } from './footer/footer.module';

// import { OauthButtonsComponent } from './oauth-buttons/oauth-buttons.component';

import { PageTitleService } from './page-title/page-title.service';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        AuthModule,
        NavbarModule,
        NavbarUserButtonModule,
        FooterModule,

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
        // OauthButtonsComponent,
    ]
})
export class DirectivesModule { }
