import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NotificationComponent } from './notification.component';
import { NotificationService } from './notification.service';

// Adapted from https://www.c-sharpcorner.com/article/toastr-like-notification-component-in-angular-7/
@NgModule({
    imports: [
        BrowserModule
    ],
    declarations: [
        NotificationComponent
    ],
    providers: [
        NotificationService
    ],
    exports: [
        NotificationComponent
    ]
})
export class NotificationModule { }
