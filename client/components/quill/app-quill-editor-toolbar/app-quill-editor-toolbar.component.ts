import { Component, OnInit } from '@angular/core';
import { QuillEditorComponent } from 'ngx-quill';


@Component({
    selector: '.app-quill-editor-toolbar',
    template: require('./app-quill-editor-toolbar.html'),
    styles: [require('./app-quill-editor-toolbar.scss')],
})
export class AppQuillEditorToolbarComponent implements OnInit {

    static parameters = [];
    constructor() { }

    ngOnInit() { }
}
