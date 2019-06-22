import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { QuillEditorComponent } from 'ngx-quill';

import { AppQuillEditorToolbarComponent } from '../app-quill-editor-toolbar/app-quill-editor-toolbar.component';

@Component({
    selector: 'app-quill-editor',
    template: require('./app-quill-editor.html'),
    styles: [require('./app-quill-editor.scss')],
})
export class AppQuillEditorComponent implements OnInit {
    @Input() private body: FormControl;
    @Input() private isReadOnly = true;
    @ViewChild('editor', { static: true }) editor: QuillEditorComponent;

    static parameters = [];
    constructor() { }

    ngOnInit() { }
}
