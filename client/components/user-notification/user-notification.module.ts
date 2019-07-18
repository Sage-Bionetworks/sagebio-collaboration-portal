import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'components/material/material.module';
import { UserNotificationButtonComponent } from './user-notification-button/user-notification-button.component';

@NgModule({
    imports: [
        MaterialModule,
        CommonModule
    ],
    declarations: [
        UserNotificationButtonComponent
    ],
    exports: [
        UserNotificationButtonComponent
    ]
})
export class UserNotificationModule { }
