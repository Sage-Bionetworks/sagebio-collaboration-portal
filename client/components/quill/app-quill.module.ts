import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';

import { AppQuillEditorComponent } from './app-quill-editor/app-quill-editor.component';
import { AppQuillEditorToolbarComponent } from './app-quill-editor-toolbar/app-quill-editor-toolbar.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
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
