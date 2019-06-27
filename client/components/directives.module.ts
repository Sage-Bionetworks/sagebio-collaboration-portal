import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppQuillModule } from './quill/app-quill.module';
import { AuthModule } from './auth/auth.module';
import { FiltersModule } from './filters/filters.module';
import { FooterModule } from './footer/footer.module';
import { MaterialModule } from './material/material.module';
import { MessagingModule } from './messaging/messaging.module';
import { NavbarModule } from './navbar/navbar.module';
import { NavbarUserButtonModule } from './navbar-user-button/navbar-user-button.module';
import { NotificationModule } from './notification/notification.module';
import { SSOButtonsModule } from './sso-buttons/sso-buttons.module'
import { SidenavModule } from './sidenav/sidenav.module';
import { SocketModule } from './socket/socket.module';
import { PageTitleService } from './page-title/page-title.service';
import { TagService } from './tag/tag.service';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,

        MaterialModule,
        AuthModule,
        NavbarUserButtonModule,
        SSOButtonsModule,
        SidenavModule,
        SocketModule
    ],
    providers: [
        PageTitleService,
        TagService
    ],
    declarations: [
        // OauthButtonsComponent,
    ],
    exports: [
        AppQuillModule,
        FiltersModule,
        FooterModule,
        MessagingModule,
        NavbarModule,
        NavbarUserButtonModule,
        NotificationModule,
        SSOButtonsModule,
        SidenavModule,
    ]
})
export class DirectivesModule { }
