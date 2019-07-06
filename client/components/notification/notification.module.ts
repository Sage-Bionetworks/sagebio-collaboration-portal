import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from 'components/material/material.module';
import { NotificationComponent } from './notification.component';
import { NotificationService } from './notification.service';
// import { SnackBarComponent } from './snack-bar/snack-bar.component';

@NgModule({
    imports: [
        BrowserModule,
        MaterialModule
    ],
    declarations: [
        NotificationComponent,
        // SnackBarComponent
    ],
    entryComponents: [
        // SnackBarComponent
    ],
    providers: [
        NotificationService
    ],
    exports: [
        NotificationComponent
    ]
})
export class NotificationModule { }
