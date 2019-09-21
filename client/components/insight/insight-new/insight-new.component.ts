import { Component, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivityService } from 'components/activity/activity.service';
import { Insight } from 'models/entities/insights/insight.model';
import { Project } from 'models/entities/project.model';
import { ActivityClass } from 'models/provenance/activity.model';
import { InsightService } from '../insight.service';
import config from '../../../app/app.constants';
import { EntityAttachmentListComponent } from 'components/entity/entity-attachment/entity-attachment-list/entity-attachment-list.component';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
// import { EntityAttachments, EntityAttachmentMode } from 'models/entities/entity.model';
import { ReferenceClass } from './../../../../shared/interfaces/provenance/activity.model';

@Component({
    selector: 'insight-new',
    template: require('./insight-new.html'),
    styles: [require('./insight-new.scss')],
})
export class InsightNewComponent {
    @Input() project: Project;
    @Output() newInsight: EventEmitter<Insight> = new EventEmitter<Insight>();
    @Output() cancel: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild(EntityAttachmentListComponent, { static: false }) attachments: EntityAttachmentListComponent<Insight>;
    private attachmentTypes: any[];

    private insightSpecs: any;
    private newForm: FormGroup;
    private errors = {
        newInsight: undefined,
    };

    static parameters = [FormBuilder, ActivityService, InsightService];
    constructor(
        private formBuilder: FormBuilder,
        private activityService: ActivityService,
        private insightService: InsightService
    ) {
        this.attachmentTypes = [
            config.entityTypes.INSIGHT,
            config.entityTypes.RESOURCE,
            config.entityTypes.PROJECT,
            config.entityTypes.DATA_CATALOG,
            config.entityTypes.TOOL,
        ];

        this.insightSpecs = config.models.insight;
        this.newForm = this.formBuilder.group({
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

    createNewInsight(project: Project): void {
        let newInsight = this.newForm.value;
        newInsight.description = JSON.stringify(newInsight.description);
        newInsight.projectId = this.project._id;

        this.insightService
            .create(newInsight)
            .pipe(
                switchMap(insight =>
                    forkJoin({
                        insight: of(insight),
                        attachments: this.attachments.createAttachments(insight),
                    })
                )
            )
            .subscribe(
                (res: any) => {
                    let insight = res.insight;

                    // TODO Do not do subscribe inside another subscribe
                    this.attachments.getAttachments().subscribe(attachments => {
                        let usedEntitiesForProvenance = attachments.map(att => ({
                            name: att.entity.title,
                            role: '',
                            targetId: att.attachment.entityId,
                            targetVersionId: '1',
                            class: att.attachment.entityType,
                            subsclass: att.attachment.entitySubType,
                        }));

                        this.activityService.save({
                            generatedName: insight.title,
                            generatedTargetId: insight._id,
                            generatedClass: ReferenceClass.INSIGHT,
                            generatedSubClass: insight.insightType,
                            usedEntities: usedEntitiesForProvenance,
                        });
                        this.newInsight.emit(insight);
                    });

                    // let provenanceAttachment = this.attachments.getAttachments(attachment => ({
                    //     name: 'plop',
                    //     role: '',
                    //     // targetId: attachment.attachment.entityId,
                    //     // targetVersionId: '1',
                    //     // class: attachment.entityType,
                    //     // subsclass: attachment.entitySubType
                    // })),

                    // list of attachments
                    // - name, _id, entityType, entitySubtype,
                    // name, role = '', targetId: _id, targetVersionId: '1', class=entityType, subclass: subsclass if available
                    // this.activityService.save({
                    //     generatedName: insight.title,
                    //     generatedTargetId: insight._id,
                    //     generatedClass: ReferenceClass.INSIGHT,
                    //     generatedSubClass: insight.insightType,
                    //     // usedEntities:
                    // });
                    // this.newInsight.emit(insight);
                },
                err => {
                    console.error(err);
                    this.errors.newInsight = err.message;
                }
            );
    }
}
