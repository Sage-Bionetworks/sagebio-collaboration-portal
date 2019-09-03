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

    private showEntityAttachmentForm = false;
    private entityAttachmentTypes;
    private attachmentForm: FormGroup;
    private attachments;

    static parameters = [FormBuilder];
    constructor (
        private formBuilder: FormBuilder,
    ) {
        this.entityAttachmentTypes = entityAttachmentTypes;
        this.attachmentForm = this.formBuilder.group({
            attachmentType: [],
        });
    }

    updateNewAttachmentType(selectedItem): void {
        const attachmentType = this.entityAttachmentTypes.find(obj => obj.type === selectedItem);
    }

    update(): void {
        // WIP Shape attachments object in the way you want them stored with the Insights object
        this.attachments = this.attachmentForm.value;
        this.updateAttachments.emit(this.attachments);
    }
}
