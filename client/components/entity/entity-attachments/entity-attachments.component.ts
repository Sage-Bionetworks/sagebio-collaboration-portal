import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
    selector: 'entity-attachments',
    template: require('./entity-attachments.html'),
    styles: [require('./entity-attachments.scss')],
})
export class EntityAttachmentsComponent {
    @Input() entityId: string;
    @Output() updateAttachments: EventEmitter<any> = new EventEmitter<any>();

    // WIP Refactor entityAttachmentTypes into shared config
    private entityAttachmentTypes = [
        { type: '-- Add an attachment --', collection: '' },
        { type: 'Report', collection: 'insights' },
        { type: 'Memo', collection: 'insights' },
        { type: 'Article', collection: 'resources' },
        { type: 'Dashboard', collection: 'resources' },
        { type: 'State', collection: 'resources' },
        { type: 'WebApp', collection: 'resources' },
    ];
    private attachmentForm: FormGroup;
    private attachments;

    static parameters = [Router, ActivatedRoute, FormBuilder];
    constructor (
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
    ) {
        this.attachmentForm = this.formBuilder.group({
            attachmentType: [],
        });
    }

    update(): void {
        // WIP Shape attachments object in the way you want them stored with the Insights object
        this.attachments = this.attachmentForm.value;
        this.updateAttachments.emit(this.attachments);
    }
}
