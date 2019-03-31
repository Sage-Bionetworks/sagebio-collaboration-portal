import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
// import { FileDropModule } from 'ngx-file-drop';

// import { DirectivesModule } from '../../components/directives.module';
import { MaterialModule } from '../../components/material/material.module';
// import { ImageCropperModule } from '../../components/image-cropper/image-cropper.module';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { SettingsComponent } from './settings/settings.component';
// import { ProfileComponent } from './profile/profile.component';

const accountRoutes: Routes = [{
  path: 'login',
  component: LoginComponent,
}, {
  path: 'settings',
  component: SettingsComponent,
}, {
  path: 'signup',
  component: SignupComponent,
},
// {
//   path: 'profile',
//   component: ProfileComponent
// }
];

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    // BrowserAnimationsModule,
    RouterModule.forChild(accountRoutes),
    // FileDropModule,
    MaterialModule,
    // ImageCropperModule
  ],
  declarations: [
    LoginComponent,
    SignupComponent,
    SettingsComponent,
    // ProfileComponent
  ],
})
export class AccountModule { }
