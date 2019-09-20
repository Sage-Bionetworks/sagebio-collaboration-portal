import { Component, Output, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Insight } from 'models/entities/insights/insight.model';
import { InsightService } from '../insight.service';
import config from '../../../app/app.constants';
import { map } from 'lodash';
import { EntityAttachmentListComponent } from 'components/entity/entity-attachment/entity-attachment-list/entity-attachment-list.component';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'insight-edit',
    template: require('./insight-edit.html'),
    styles: [require('./insight-edit.scss')],
})
export class InsightEditComponent implements OnInit {
    @Input() insight: Insight;
    @Output() insightEdit: EventEmitter<Insight> = new EventEmitter<Insight>();
    @Output() cancel: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild(EntityAttachmentListComponent, { static: false }) attachments: EntityAttachmentListComponent<Insight>;
    private attachmentTypes: any[];

    private insightSpecs: any;
    private editForm: FormGroup;
    private errors = {
        editInsight: undefined,
    };

    static parameters = [FormBuilder, InsightService];
    constructor(private formBuilder: FormBuilder, private insightService: InsightService) {
        this.attachmentTypes = [
            config.entityTypes.INSIGHT,
            config.entityTypes.RESOURCE,
            config.entityTypes.PROJECT,
            config.entityTypes.DATA_CATALOG,
            config.entityTypes.TOOL,
        ];

        this.insightSpecs = config.models.insight;
        this.editForm = this.formBuilder.group({
            title: [
                '',
                [
                    Validators.required,
                    Validators.minLength(this.insightSpecs.title.minlength),
                    Validators.maxLength(this.insightSpecs.title.maxlength),
                ],
            ],
            description: [
                '',
                [
                    Validators.required,
                    Validators.minLength(this.insightSpecs.description.minlength),
                    Validators.maxLength(this.insightSpecs.description.maxlength),
                ],
            ],
            insightType: [this.insightSpecs.type.default.value, [Validators.required]],
        });
    }

    ngOnInit() {
        if (this.insight) {
            this.editForm.setValue({
                title: this.insight.title,
                description: JSON.parse(this.insight.description),
                insightType: this.insight.insightType,
            });
            this.editForm.markAllAsTouched();
        }
    }

    updateInsight(): void {
        let editedInsight = this.editForm.value;
        // editedTool.slug = slugify(this.editForm.value.name).toLowerCase();
        const patches = map(editedInsight, (value, key) => ({
            op: 'replace',
            path: `/${key}`,
            value: value,
        }));

        // need to convert the quill-based description
        let patchIndex = patches.findIndex(patch => patch.path === '/description');
        patches[patchIndex].value = JSON.stringify(patches[patchIndex].value);

        forkJoin({
            insight: this.insightService.update(this.insight._id, patches),
            attachmentsUpdate: this.attachments.updateAttachments(),
        }).subscribe(
            res => {
                this.insightEdit.emit(res.insight);
                this.cancel.emit(null);
            },
            err => {
                console.error(err);
                this.errors.editInsight = err.message || err;
            }
        );
    }
}
