import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'components/material/material.module';
import { SecondarySidenavComponent } from './secondary-sidenav/secondary-sidenav.component';
import { SecondarySidenavService } from './secondary-sidenav/secondary-sidenav.service';
import { SidenavHostDirective } from './sidenav-host.directive';

import { ThreadSidenavComponent } from 'components/messaging/thread-sidenav/thread-sidenav.component';
import { ActivitySidenavComponent } from 'components/activity/activity-sidenav/activity-sidenav.component';
import { UserNotificationSidenavComponent } from 'components/user-notification/user-notification-sidenav/user-notification-sidenav.component';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule
    ],
    providers: [
        SecondarySidenavService
    ],
    declarations: [
        SecondarySidenavComponent,
        SidenavHostDirective
    ],
    exports: [
        SecondarySidenavComponent
    ],
    entryComponents: [
        ThreadSidenavComponent,
        ActivitySidenavComponent,
        UserNotificationSidenavComponent
    ]
})
export class SidenavModule { }
