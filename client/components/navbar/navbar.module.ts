import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'components/material/material.module';
import { UserNotificationModule } from 'components/user-notification/user-notification.module';
import { NavbarUserButtonModule } from 'components/navbar-user-button/navbar-user-button.module';
import { NavbarComponent } from './navbar.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    UserNotificationModule,
    NavbarUserButtonModule
  ],
  declarations: [NavbarComponent],
  exports: [NavbarComponent]
})
export class NavbarModule { }
