import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { EntityModule } from 'components/entity/entity.module';
import { MaterialModule } from 'components/material/material.module';
import { MessagingModule } from 'components/messaging/messaging.module';
import { AuthGuard } from 'components/auth/auth-guard.service';
import { SocketService } from 'components/socket/socket.service';
import { AppService } from '../app.service';

import { DiscussionComponent } from './discussion.component';
import { DiscussionNewComponent } from './discussion-new/discussion-new.component';

export const ROUTES: Routes = [
    {
        path: 'discussion',
        component: DiscussionComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'discussion/new',
        component: DiscussionNewComponent,
        canActivate: [AuthGuard],
    },
];

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        EntityModule,
        MaterialModule,
        MessagingModule,
        RouterModule.forChild(ROUTES),
    ],
    declarations: [DiscussionComponent, DiscussionNewComponent],
    providers: [AppService, SocketService],
    exports: [],
})
export class DiscussionModule {}
