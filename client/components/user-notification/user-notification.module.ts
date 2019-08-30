import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'components/material/material.module';
import { SidenavModule } from 'components/sidenav/sidenav.module';
import { UserAvatarModule } from 'components/user-avatar/user-avatar.module';
import { UserNotificationButtonComponent } from './user-notification-button/user-notification-button.component';
import { UserNotificationSidenavComponent } from './user-notification-sidenav/user-notification-sidenav.component';
import { MessageNotificationViewComponent } from './message-notification-view/message-notification-view.component';
import { EntityNotificationViewComponent } from './entity-notification-view/entity-notification-view.component';
import { EntityAccessNotificationViewComponent } from './entity-access-notification-view/entity-access-notification-view.component';
import { UserNotificationService } from './user-notification.service';

// import { UserCardComponent } from '../../app/account/profile/user-card/user-card.component'
// import { UserNotificationViewComponent } from './user-notification-view/user-notification-view.component';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        SidenavModule,
        UserAvatarModule,
    ],
    providers: [
        UserNotificationService
    ],
    declarations: [
        UserNotificationButtonComponent,
        UserNotificationSidenavComponent,
        MessageNotificationViewComponent,
        EntityNotificationViewComponent,
        EntityAccessNotificationViewComponent,
        // UserCardComponent
    ],
    exports: [
        UserNotificationButtonComponent,
        UserNotificationSidenavComponent
    ]
})
export class UserNotificationModule { }
