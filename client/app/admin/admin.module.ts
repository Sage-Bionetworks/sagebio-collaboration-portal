import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../../components/material/material.module';
// import { ImageModule } from '../../components/image/image.module';
import { AuthGuard } from '../../components/auth/auth-guard.service';
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
        // ImageModule
    ],
    declarations: [
        AdminComponent,
    ],
    exports: [
        AdminComponent,
    ],
})
export class AdminModule { }
