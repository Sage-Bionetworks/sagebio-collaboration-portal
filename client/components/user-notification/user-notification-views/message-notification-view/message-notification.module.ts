import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'components/material/material.module';
import { UserAvatarModule } from 'components/user-avatar/user-avatar.module';
import { UserCardComponent } from '../../../../app/account/profile/user-card/user-card.component'
import { MessageNotificationViewComponent } from './message-notification-view.component'

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    UserAvatarModule,
  ],
  declarations: [
    UserCardComponent,
    MessageNotificationViewComponent
  ],
  exports: [
    MessageNotificationViewComponent
  ]
})
export class MessageNotificationModule { }
