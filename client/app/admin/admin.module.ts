import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { MaterialModule } from 'components/material/material.module';
import { UserAvatarModule } from '../../components/user-avatar/user-avatar.module';
import { AuthGuard } from 'components/auth/auth-guard.service';

import { AdminComponent } from './admin.component';

const adminRoutes: Routes = [{
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
}];

@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forChild(adminRoutes),
        MaterialModule,
        UserAvatarModule
    ],
    declarations: [
        AdminComponent,
    ],
    exports: [
        AdminComponent,
    ],
})
export class AdminModule { }
