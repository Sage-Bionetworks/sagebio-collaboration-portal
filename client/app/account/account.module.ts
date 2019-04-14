import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AvatarModule } from 'ng2-avatar';

import { MaterialModule } from '../../components/material/material.module';
import { OAuthButtonsModule } from '../../components/oauth-buttons/oauth-buttons.module';

import { LoginComponent } from './login/login.component';
import { SettingsComponent } from './settings/settings.component';
import { ProfileComponent } from './profile/profile.component';
import { UserCardComponent } from './profile/user-card/user-card.component';

const accountRoutes: Routes = [{
    path: 'login',
    component: LoginComponent,
}, {
    path: 'settings',
    component: SettingsComponent,
}, {
    path: 'profile',
    component: ProfileComponent
}];

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        BrowserModule,
        RouterModule.forChild(accountRoutes),
        AvatarModule,
        MaterialModule,
        OAuthButtonsModule
    ],
    declarations: [
        LoginComponent,
        SettingsComponent,
        ProfileComponent,
        UserCardComponent
    ],
})
export class AccountModule { }
