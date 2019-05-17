import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { QuillModule } from 'ngx-quill';

import { MaterialModule } from '../../components/material/material.module';
import { AuthGuard } from '../../components/auth/auth-guard.service';

import { PostListComponent } from './post-list/post-list.component';
import { PostViewComponent } from './post-view/post-view.component';

import { DiscussionService } from './discussion.service';

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
        RouterModule.forChild(ROUTES),
        QuillModule.forRoot({
            modules: {
                // syntax: true,
                // toolbar: [...]
            }
        }),
    ],
    declarations: [
        PostListComponent,
        PostViewComponent
    ],
    providers: [
        DiscussionService
    ],
    exports: [
        // ToolListComponent,
        // ToolViewComponent,
        // ToolComponent
    ],
})
export class DiscussionModule { }
