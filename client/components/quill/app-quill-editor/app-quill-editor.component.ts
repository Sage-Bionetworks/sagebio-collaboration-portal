import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map } from 'rxjs/operators';

import katex from 'katex';
import Quill from 'quill';
import { ImageDrop } from 'quill-image-drop-module';
import 'quill-emoji';
import 'quill-mention';
import hljs from 'highlight.js';
// hljs.configure({
//     languages: ['javascript', 'ruby', 'python']
// });
import { QuillEditorComponent } from 'ngx-quill';

import { UserService } from '../../auth/user.service';
import { AppQuillEditorToolbarComponent } from '../app-quill-editor-toolbar/app-quill-editor-toolbar.component';

/**
 * REGISTER QUILL MODULES
 */
Quill.register('modules/imageDrop', ImageDrop);

@Component({
    selector: 'app-quill-editor',
    template: require('./app-quill-editor.html'),
    styles: [require('./app-quill-editor.scss')],
    encapsulation: ViewEncapsulation.None
})
export class AppQuillEditorComponent implements OnInit {
    @Input() private body: FormControl;
    @Input() private placeholder = 'Insert text here';
    @Input() private saveButtonLabel = 'Save';
    @Input() private cancelButtonLabel = 'Cancel';
    @Input() private editButtonLabel = 'Edit';
    @Input() private isReadOnly = true;
    @Input() private showActions = true;
    @Output() onSave: EventEmitter<any> = new EventEmitter<any>();
    @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('editor', { static: true }) editor: QuillEditorComponent;
    private bodyOnCancel = {
        ops: []
    };

    private modules = {
        imageDrop: true,
        formula: true,
        'emoji-shortname': true,  // press ':' to show emoji options
        'emoji-textarea': false,  // add emoji menu button to text area
        'emoji-toolbar': true,  // if false, input field replace emoji menu
        syntax: {
            highlight: text => hljs.highlightAuto(text).value
        },
        mention: {
            allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
            onSelect: (item, insertItem) => {
                const editor = this.editor.quillEditor as Quill;
                insertItem(item);
                // necessary because quill-mention triggers changes as 'api' instead of 'user'
                editor.insertText(editor.getLength() - 1, '', 'user');
            },
            source: (searchTerm, renderList) => {
                this.userService.query()
                    .pipe(
                        map(users => users.map(user => ({
                            id: user._id,
                            value: user.username
                        })))
                    )
                    .subscribe(values => {
                        if (searchTerm.length === 0) {
                            renderList(values, searchTerm);
                        } else {
                            const matches = [];
                            values.forEach((entry) => {
                                if (entry.value.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
                                    matches.push(entry);
                                }
                            });
                            renderList(matches, searchTerm);
                        }
                    });
            }
        },
    };

    static parameters = [UserService];
    constructor(private userService: UserService) {
        (<any>window).katex = katex;  // where ngx-quill looks for katex
    }

    ngOnInit() {
        this.bodyOnCancel = this.body.value;
    }

    cancel(): void {
        this.body.setValue(this.bodyOnCancel);
        this.isReadOnly = true;
        this.onCancel.emit(undefined);
    }

    edit(): void {
        this.isReadOnly = false;
    }

    save(): void {
        this.bodyOnCancel = this.body.value;
        this.isReadOnly = true;
        this.onSave.emit(undefined);
    }
}
