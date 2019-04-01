import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { MaterialModule } from '../../components/material/material.module';

import { LoginComponent } from './login/login.component';
import { SettingsComponent } from './settings/settings.component';
import { ProfileComponent } from './profile/profile.component';

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
        MaterialModule,
    ],
    declarations: [
        LoginComponent,
        SettingsComponent,
        ProfileComponent
    ],
})
export class AccountModule { }
