import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

import { QuillEditorComponent } from 'ngx-quill';
import Quill from 'quill';
import { ImageDrop } from 'quill-image-drop-module';
import 'quill-emoji';
import hljs from 'highlight.js';
hljs.configure({
    // languages: ['javascript', 'ruby', 'python']
});

import { AppQuillEditorToolbarComponent } from '../app-quill-editor-toolbar/app-quill-editor-toolbar.component';

/**
 * REGISTER QUILL MODULES
 */
Quill.register('modules/imageDrop', ImageDrop);

@Component({
    selector: 'app-quill-editor',
    template: require('./app-quill-editor.html'),
    styles: [require('./app-quill-editor.scss')],
})
export class AppQuillEditorComponent implements OnInit {
    @Input() private body: FormControl;
    @Input() private isReadOnly = true;
    @ViewChild('editor', { static: true }) editor: QuillEditorComponent;

    private modules = {
        imageDrop: true,
        'emoji-shortname': true,  // press ':' to show emoji options
        'emoji-textarea': false,  // add emoji menu button to text area
        'emoji-toolbar': true,  // if false, input field replace emoji menu
        syntax: {
            highlight: text => hljs.highlightAuto(text).value
        },
        //     mention: {
        //         allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
        //         onSelect: (item, insertItem) => {
        //             const editor = this.editor.quillEditor as Quill;
        //             insertItem(item);
        //             // necessary because quill-mention triggers changes as 'api' instead of 'user'
        //             editor.insertText(editor.getLength() - 1, '', 'user');
        //         },
        //         source: (searchTerm, renderList) => {
        //             const values = [
        //                 { id: 1, value: 'Fredrik Sundqvist' },
        //                 { id: 2, value: 'Patrik Sjölin' }
        //             ];
        //
        //             if (searchTerm.length === 0) {
        //                 renderList(values, searchTerm);
        //             } else {
        //                 const matches = [];
        //
        //                 values.forEach((entry) => {
        //                     if (entry.value.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
        //                         matches.push(entry);
        //                     }
        //                 });
        //                 renderList(matches, searchTerm);
        //             }
        //         }
        //     },
    };

    static parameters = [];
    constructor() {
    }

    ngOnInit() { }
}
