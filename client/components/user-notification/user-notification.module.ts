import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'components/material/material.module';
import { SidenavModule } from 'components/sidenav/sidenav.module';
import { UserNotificationButtonComponent } from './user-notification-button/user-notification-button.component';
import { UserNotificationSidenavComponent } from './user-notification-sidenav/user-notification-sidenav.component';
import { UserNotificationViewComponent } from './user-notification-view/user-notification-view.component';
import { UserNotificationService } from './user-notification.service';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        SidenavModule
    ],
    providers: [
        UserNotificationService
    ],
    declarations: [
        UserNotificationButtonComponent,
        UserNotificationSidenavComponent,
        UserNotificationViewComponent
    ],
    exports: [
      UserNotificationButtonComponent,
      UserNotificationSidenavComponent
    ]
})
export class UserNotificationModule { }
