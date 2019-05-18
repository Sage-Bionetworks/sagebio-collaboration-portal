import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MaterialModule } from './material/material.module';

import { AuthModule } from './auth/auth.module';
import { NavbarModule } from './navbar/navbar.module';
import { NavbarUserButtonModule } from './navbar-user-button/navbar-user-button.module';
import { NotificationModule } from './notification/notification.module';
import { FooterModule } from './footer/footer.module';
import { OAuthButtonsModule } from './oauth-buttons/oauth-buttons.module';

import { PageTitleService } from './page-title/page-title.service';
import { FiltersModule } from './filters/filters.module';
import { DiscussionModule } from './discussion/discussion.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,

        MaterialModule,
        AuthModule,
        NavbarUserButtonModule,
        OAuthButtonsModule,
    ],
    providers: [
        PageTitleService
    ],
    declarations: [
        // OauthButtonsComponent,
    ],
    exports: [
        DiscussionModule,
        FiltersModule,
        FooterModule,
        NavbarModule,
        NavbarUserButtonModule,
        NotificationModule,
        OAuthButtonsModule,
    ]
})
export class DirectivesModule { }
