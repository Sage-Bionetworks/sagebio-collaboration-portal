import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AvatarModule } from 'ng2-avatar';

import { AuthModule } from 'components/auth/auth.module';
import { MaterialModule } from 'components/material/material.module';
import { SSOButtonsModule } from 'components/sso-buttons/sso-buttons.module';
import { NotificationModule } from 'components/notification/notification.module';
import { MessagingModule } from 'components/messaging/messaging.module';
import { AuthGuard } from 'components/auth/auth-guard.service';
import { ActivityModule } from 'components/activity/activity.module';

import { LoginComponent } from './login/login.component';
import { SettingsComponent } from './settings/settings.component';
import { ProfileComponent } from './profile/profile.component';
import { UserCardComponent } from './profile/user-card/user-card.component';
import { UserCardEditComponent } from './profile/user-card-edit/user-card-edit.component';

const accountRoutes: Routes = [{
    path: 'login',
    component: LoginComponent
    // canActivate: [AuthGuard]
}, {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthGuard]
}, {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
}];

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        BrowserModule,
        RouterModule.forChild(accountRoutes),
        ActivityModule,
        AvatarModule,
        MaterialModule,
        SSOButtonsModule,
        NotificationModule,
        MessagingModule
    ],
    declarations: [
        LoginComponent,
        SettingsComponent,
        ProfileComponent,
        UserCardComponent,
        UserCardEditComponent,
    ],
})
export class AccountModule { }
