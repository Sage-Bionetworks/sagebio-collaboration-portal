import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'components/material/material.module';
import { SidenavModule } from 'components/sidenav/sidenav.module';
import { UserAvatarModule } from 'components/user-avatar/user-avatar.module';
import { UserNotificationButtonComponent } from './user-notification-button/user-notification-button.component';
import { UserNotificationSidenavComponent } from './user-notification-sidenav/user-notification-sidenav.component';
import { MessageNotificationViewComponent } from './user-notification-cards/message-notification-view/message-notification-view.component';
import { EntityNotificationCardComponent } from './user-notification-cards/entity-notification-card/entity-notification-card.component';
import { EntityAccessNotificationCardComponent } from './user-notification-cards/entity-access-notification-card/entity-access-notification-card.component';
import { UserNotificationService } from './user-notification.service';
import { PipesModule } from 'components/pipes/pipes.module'
import { UserNotificationSidenavService } from './user-notification-sidenav/user-notification-sidenav.service';
import { QuillModule } from 'ngx-quill';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        SidenavModule,
        UserAvatarModule,
        PipesModule,
        QuillModule.forRoot(),
    ],
    providers: [
        UserNotificationService,
        UserNotificationSidenavService,
    ],
    declarations: [
        UserNotificationButtonComponent,
        UserNotificationSidenavComponent,
        MessageNotificationViewComponent,
        EntityNotificationCardComponent,
        EntityAccessNotificationCardComponent,
    ],
    exports: [
        UserNotificationButtonComponent,
        UserNotificationSidenavComponent
    ]
})
export class UserNotificationModule { }
