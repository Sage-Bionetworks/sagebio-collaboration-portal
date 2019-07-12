import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { MaterialModule } from 'components/material/material.module';
import { UserAvatarModule } from '../../components/user-avatar/user-avatar.module';
import { NotificationModule } from 'components/notification/notification.module';

import { AdminComponent } from './admin.component';
import { AdminUserComponent } from  './admin-user/admin-user.component';

import { AuthGuard } from 'components/auth/auth-guard.service';


const adminRoutes: Routes = [{
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
},
{
    path: 'admin/user/:id',
    component: AdminUserComponent,
    canActivate: [AuthGuard],
}];

@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forChild(adminRoutes),
        MaterialModule,
        UserAvatarModule,
        NotificationModule
    ],
    declarations: [
        AdminComponent,
        AdminUserComponent
    ],
    exports: [
        AdminComponent,
        AdminUserComponent
    ]
})
export class AdminModule { }
