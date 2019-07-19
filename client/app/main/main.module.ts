import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { RouterModule, Routes } from '@angular/router';

import { MaterialModule } from 'components/material/material.module';
import { NotificationModule } from 'components/notification/notification.module';
import { ProvenanceModule } from 'components/provenance/provenance.module';

import { MainComponent } from './main.component';
import { SocketService } from 'components/socket/socket.service';

export const ROUTES: Routes = [
    { path: 'home', component: MainComponent },
];

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule.forChild(ROUTES),
        MaterialModule,
        NotificationModule,
        ProvenanceModule
    ],
    declarations: [
        MainComponent,
    ],
    providers: [
        SocketService,
    ],
    exports: [
        MainComponent,
    ],
})
export class MainModule {}
