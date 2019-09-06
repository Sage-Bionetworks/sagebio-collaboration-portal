import { values } from 'lodash/fp';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { entityAttachmentTypes } from '../../../../server/config/environment/shared';
import { EntityAttachments, EntityAttachmentMode, EntityAttachmentKeys } from 'models/entities/entity.model';
import { InsightAttachment } from 'models/entities/insights/insight.model';
import { ResourceAttachment } from 'models/entities/resources/resource.model';

@Component({
    selector: 'entity-attachments',
    template: require('./entity-attachments.html'),
    styles: [require('./entity-attachments.scss')],
})
export class EntityAttachmentsComponent implements OnInit {
    @Input() entityId: string;
    @Input() attachments: EntityAttachments;
    private insights: InsightAttachment[];
    private resources: ResourceAttachment[];
    @Input() mode: EntityAttachmentMode;
    @Output() updateAttachments: EventEmitter<any> = new EventEmitter<any>();

    private entityAttachmentTypes;
    private showEntityAttachmentForm = false;
    private isReadOnly = true;
    private attachmentForm: FormGroup;
    private newInsightAttachment: InsightAttachment | null;
    private newResourceAttachment: ResourceAttachment | null;

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
        this.mode = this.mode || EntityAttachmentMode.DISPLAY;
        this.isReadOnly = this.mode === EntityAttachmentMode.DISPLAY;
        this.newInsightAttachment = null;
        this.newResourceAttachment = null;

        // Parse attachments
        this.insights = (this.attachments && this.attachments.insights) ? this.attachments.insights : [];
        this.resources = (this.attachments && this.attachments.resources) ? this.attachments.resources : [];
    }

    // // WIP Remove attachment needs to remove from this.attachments.whatever
    // removeAttachment(indexOfAttachment): void {
    //     // this.attachments.splice(indexOfAttachment, 1);
    //     this.updateAttachments.emit(this.attachments);
    // }

    removeInsightAttachment(indexOfAttachment): void {
        try {
            this.attachments.insights.splice(indexOfAttachment, 1);
        } catch (e) {
            console.log(`ERROR attempting to remove Insight attachment: ${e}`);
        } finally {
            this.updateAttachments.emit(this.attachments);
        }
    }

    removeResourceAttachment(indexOfAttachment): void {
        try {
            this.attachments.resources.splice(indexOfAttachment, 1);
        } catch (e) {
            console.log(`ERROR attempting to remove Resource attachment: ${e}`);
        } finally {
            this.updateAttachments.emit(this.attachments);
        }
    }

    updateNewAttachmentType(selectedItem): void {
        const type = selectedItem.source.selected.group.label;
        const model = selectedItem.value;

        switch (type) {
            case EntityAttachmentKeys.INSIGHT:
                this.newInsightAttachment = {
                    entityType: model,
                };
                break;
            case EntityAttachmentKeys.RESOURCE:
                this.newResourceAttachment = {
                    entityType: model,
                };
                break;
            default:
                console.log(`Received unexpected attachment type ${type}`);
                this.newInsightAttachment = null;
                this.newResourceAttachment = null;
                break;
        }
    }

    update(): void {
        const attachmentName = this.attachmentForm.value.attachmentName;

        if (this.newInsightAttachment) {
            this.newInsightAttachment.name = attachmentName;
            this.insights.push(this.newInsightAttachment);
        }

        if (this.newResourceAttachment) {
            this.newResourceAttachment.name = attachmentName;
            this.resources.push(this.newResourceAttachment);
        }

        this.attachments = {
            insights: this.insights,
            resources: this.resources,
        };

        this.updateAttachments.emit(this.attachments);

        // Clear form
        this.attachmentForm.reset();
        this.newInsightAttachment = null;
        this.newResourceAttachment = null;
        this.showEntityAttachmentForm = false;
    }
}
