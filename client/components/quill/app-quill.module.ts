import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill';
import { AppQuillEditorToolbarComponent } from './app-quill-editor-toolbar/app-quill-editor-toolbar.component';

@NgModule({
    imports: [
        CommonModule,
        QuillModule
    ],
    providers: [
    ],
    declarations: [
        AppQuillEditorToolbarComponent
    ],
    exports: [
        AppQuillEditorToolbarComponent
    ]
})
export class AppQuillModule { }
