import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { RouterModule, Routes } from '@angular/router';

import { MaterialModule } from 'components/material/material.module';
import { NotificationModule } from 'components/notification/notification.module';

import { DocsComponent } from './docs.component';
import { SocketService } from 'components/socket/socket.service';

export const ROUTES: Routes = [
    { path: 'docs', component: DocsComponent },
];

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule.forChild(ROUTES),
        MaterialModule,
        NotificationModule,
    ],
    declarations: [
        DocsComponent
    ],
    providers: [
        SocketService,
    ],
    exports: [],
})
export class DocsModule {}
