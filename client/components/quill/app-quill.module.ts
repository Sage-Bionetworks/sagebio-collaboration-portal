import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';

import { AuthModule } from '../auth/auth.module';

import { AppQuillEditorComponent } from './app-quill-editor/app-quill-editor.component';
import { AppQuillEditorToolbarComponent } from './app-quill-editor-toolbar/app-quill-editor-toolbar.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AuthModule,
        QuillModule
    ],
    providers: [
    ],
    declarations: [
        AppQuillEditorComponent,
        AppQuillEditorToolbarComponent
    ],
    exports: [
        AppQuillEditorComponent,
        AppQuillEditorToolbarComponent
    ]
})
export class AppQuillModule { }
