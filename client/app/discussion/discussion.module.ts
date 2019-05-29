import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from '../../components/material/material.module';
import { MessagingModule } from '../../components/messaging/messaging.module';
import { AuthGuard } from '../../components/auth/auth-guard.service';
import { PostListComponent } from './post-list/post-list.component';
import { PostViewComponent } from './post-view/post-view.component';
// import { MessageComponent } from '../../components/discussion/message/message.component';

// import { DiscussionModule } from '../../components/discussion/discussion.module';

export const ROUTES: Routes = [{
    path: 'discussion',
    component: PostListComponent,
    canActivate: [AuthGuard],
    data: {}
}];

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        MessagingModule,
        RouterModule.forChild(ROUTES)
    ],
    declarations: [
        PostListComponent,
        PostViewComponent
    ],
    providers: [
    ],
    exports: [
        // ToolListComponent,
        // ToolViewComponent,
        // ToolComponent
    ],
})
export class DiscussionModule { }
