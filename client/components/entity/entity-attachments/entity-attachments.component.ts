import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { entityAttachmentTypes } from '../../../../server/config/environment/shared';
import { EntityAttachment } from 'models/entities/entity.model';
import { thresholdFreedmanDiaconis } from 'd3';

@Component({
    selector: 'entity-attachments',
    template: require('./entity-attachments.html'),
    styles: [require('./entity-attachments.scss')],
})
export class EntityAttachmentsComponent {
    @Input() entityId: string;
    @Output() updateAttachments: EventEmitter<any> = new EventEmitter<any>();

    private entityAttachmentTypes;
    // WIP Temporary - We need to populate attachments associated with the current entity
    private attachments = [];
    private showEntityAttachmentForm = false;
    private attachmentForm: FormGroup;
    private newAttachment: EntityAttachment;

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

    removeAttachment(indexOfAttachment): void {
        this.attachments.splice(indexOfAttachment, 1);
    }

    updateNewAttachmentType(selectedItem): void {
        this.newAttachment = {
            collection: selectedItem.source.selected.group.label.toLowerCase() || '',
            type: selectedItem.value,
        };
    }

    update(): void {
        const entityAttachment: EntityAttachment = {
            ...this.newAttachment,
            name: this.attachmentForm.value.attachmentName,
        };

        this.attachments.push(entityAttachment);
        this.updateAttachments.emit(this.attachments);

        // Clear form
        this.attachmentForm.reset();
        this.newAttachment = null;
        this.showEntityAttachmentForm = false;
    }
}
