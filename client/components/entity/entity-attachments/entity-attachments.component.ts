import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { entityAttachmentTypes } from '../../../../server/config/environment/shared';
import { EntityAttachment, EntityAttachmentMode } from 'models/entities/entity.model';

@Component({
    selector: 'entity-attachments',
    template: require('./entity-attachments.html'),
    styles: [require('./entity-attachments.scss')],
})
export class EntityAttachmentsComponent implements OnInit {
    @Input() entityId: string;
    @Input() attachments: EntityAttachment[];
    @Input() mode: EntityAttachmentMode;
    @Output() updateAttachments: EventEmitter<any> = new EventEmitter<any>();

    private entityAttachmentTypes;
    private showEntityAttachmentForm = false;
    private isReadOnly = true;
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

    ngOnInit() {
        this.attachments = this.attachments || [];
        this.mode = this.mode || EntityAttachmentMode.DISPLAY;
        this.isReadOnly = this.mode === EntityAttachmentMode.DISPLAY;
    }

    removeAttachment(indexOfAttachment): void {
        this.attachments.splice(indexOfAttachment, 1);
    }

    updateNewAttachmentType(selectedItem): void {
        this.newAttachment = {
            source: selectedItem.source.selected.group.label.toLowerCase() || '',
            model: selectedItem.value,
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
