import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from 'components/material/material.module';
import { AuthGuard } from 'components/auth/auth-guard.service';
import { SocketService } from 'components/socket/socket.service';
import { ConfirmationDialog } from 'components/confirmation-dialog/confirmation-dialog.component';

import { ToolNewComponent } from './tool-new/tool-new.component';
import { ToolListComponent } from './tool-list/tool-list.component';
import { ToolViewComponent } from './tool-view/tool-view.component';
import { ToolComponent } from './tool-page/tool.component';
import { ToolService } from './tool.service';

export const ROUTES: Routes = [{
    path: 'tools',
    component: ToolListComponent,
    canActivate: [AuthGuard],
    data: {}
}, {
    path: 'tools/:slug',
    component: ToolComponent,
    canActivate: [AuthGuard],
    data: {}
}];

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        RouterModule.forChild(ROUTES)
    ],
    declarations: [
        ToolListComponent,
        ToolViewComponent,
        ToolComponent,
        ToolNewComponent,
        ConfirmationDialog,
    ],
    providers: [
        SocketService,
        ToolService
    ],
    exports: [
        ToolListComponent,
        ToolViewComponent,
        ToolComponent,
        ToolNewComponent,
        ConfirmationDialog,
    ],
    entryComponents: [
        ConfirmationDialog,
    ]
})
export class ToolModule { }
