import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { entityAttachmentTypes } from '../../../../server/config/environment/shared';

import { EntityAttachments, EntityAttachmentMode, EntityAttachmentKeys } from 'models/entities/entity.model';
import { InsightAttachment } from 'models/entities/insights/insight.model';
import { ResourceAttachment } from 'models/entities/resources/resource.model';

import { InsightService } from 'components/insight/insight.service';
import { ResourceService } from 'components/resource/resource.service';

@Component({
    selector: 'entity-attachments',
    template: require('./entity-attachments.html'),
    styles: [require('./entity-attachments.scss')],
})
export class EntityAttachmentsComponent implements OnInit {
    @Input() entityId: string;
    @Input() attachments: EntityAttachments;
    @Input() mode: EntityAttachmentMode;
    @Output() updateAttachments: EventEmitter<any> = new EventEmitter<any>();

    private entityAttachmentTypes;
    private showEntityAttachmentForm = false;
    private isReadOnly = true;
    private attachmentForm: FormGroup;
    private options;

    // Attachments
    private insights: InsightAttachment[];
    private newInsightAttachment: InsightAttachment | null;
    private resources: ResourceAttachment[];
    private newResourceAttachment: ResourceAttachment | null;

    static parameters = [FormBuilder, InsightService, ResourceService];
    constructor (
        private formBuilder: FormBuilder,
        private insightService: InsightService,
        private resourceService: ResourceService,
    ) {
        this.entityAttachmentTypes = entityAttachmentTypes;
        this.attachmentForm = this.formBuilder.group({
            attachmentType: [],
            attachmentId: [],
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

    updateNewAttachmentType(selectedItem) {
        const type = selectedItem.source.selected.group.label;
        const model = selectedItem.value;

        switch (type) {
            case EntityAttachmentKeys.INSIGHT:
                this.newInsightAttachment = {
                    entityType: model,
                };

                const insightQuery = { insightType: model.toLowerCase(), // Current implementation -> "report", "memo", etc
                    projectId: this.entityId };

                this.insightService.query(insightQuery)
                    .subscribe(insights => {
                        console.log(`
                            Found ${insights.count} matching ${model} insight(s) for projectId ${this.entityId}
                        `);
                        this.options = insights.results;
                    }, err => {
                        console.log(err);
                    });
                break;

            case EntityAttachmentKeys.RESOURCE:
                this.newResourceAttachment = {
                    entityType: model,
                };

                const resourceQuery = { resourceType: model, // Current implementation -> "Article", "Dashboard", etc
                    projectId: this.entityId };

                this.resourceService.query(resourceQuery)
                    .subscribe(resources => {
                        console.log(`
                            Found ${resources.count} matching ${model} resource(s) for projectId ${this.entityId}
                        `);
                        this.options = resources.results;
                    }, err => {
                        console.log(err);
                    });
                break;

            default:
                console.log(`Received unexpected attachment type ${type}`);
                this.newInsightAttachment = null;
                this.newResourceAttachment = null;
                break;
        }
    }

    update(event): void {
        const attachmentName = event.source.triggerValue || '';
        const attachmentId = this.attachmentForm.value.attachmentId;

        if (this.newInsightAttachment) {
            this.newInsightAttachment.name = attachmentName;
            this.newInsightAttachment.entityId = attachmentId;

            this.insights.push(this.newInsightAttachment);
        }

        if (this.newResourceAttachment) {
            this.newResourceAttachment.name = attachmentName;
            this.newResourceAttachment.entityId = attachmentId;

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
