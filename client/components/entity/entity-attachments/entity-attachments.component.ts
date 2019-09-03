import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { entityAttachmentTypes } from '../../../../server/config/environment/shared';

@Component({
    selector: 'entity-attachments',
    template: require('./entity-attachments.html'),
    styles: [require('./entity-attachments.scss')],
})
export class EntityAttachmentsComponent {
    @Input() entityId: string;
    @Output() updateAttachments: EventEmitter<any> = new EventEmitter<any>();

    private entityAttachmentTypes;
    // private attachments = [];
    // WIP Remove hardcoded mock attachments
    private attachments = [
        { 'attachmentType': 'Article', 'attachmentName': 'Article #1' },
        { 'attachmentType': 'Report', 'attachmentName': 'Report #1' },
    ];

    private showEntityAttachmentForm = false;
    private attachmentForm: FormGroup;
    private newAttachment;

    static parameters = [FormBuilder];
    constructor (
        private formBuilder: FormBuilder,
    ) {
        this.entityAttachmentTypes = entityAttachmentTypes;
        this.attachmentForm = this.formBuilder.group({
            attachmentType: [],
            attachmentName: [],
        });
    }

    updateNewAttachmentType(selectedItem): void {
        this.newAttachment = this.entityAttachmentTypes.find(obj => obj.type === selectedItem);
    }

    update(): void {
        // WIP Shape attachments object in the way you want them stored with the Insights object
        this.attachments.push(this.attachmentForm.value);
        this.updateAttachments.emit(this.attachments);

        // Clear form
        this.attachmentForm.reset();
        this.showEntityAttachmentForm = false;
    }
}
