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
import { switchMap, take, map, catchError } from 'rxjs/operators';
// import { EntityAttachments, EntityAttachmentMode } from 'models/entities/entity.model';
import { ReferenceClass } from './../../../../shared/interfaces/provenance/activity.model';
import { NotificationService } from 'components/notification/notification.service';

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

    static parameters = [FormBuilder, ActivityService, InsightService, NotificationService];
    constructor(
        private formBuilder: FormBuilder,
        private activityService: ActivityService,
        private insightService: InsightService,
        private notificationService: NotificationService
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
                        attachments: this.attachments.createAttachments(insight).pipe(
                            switchMap(() => this.attachments.getAttachments()), // get bundles that have extra info
                            take(1)
                        ),
                    })
                ),
                // Save activity
                switchMap((res: any) => {
                    let insight = res.insight;
                    let attachments = res.attachments;

                    let usedEntities = attachments.map(att => ({
                        name: att.entity.title,
                        role: '',
                        targetId: att.attachment.entityId,
                        targetVersionId: '1',
                        class: att.attachment.entityType,
                        subsclass: att.attachment.entitySubType,
                    }));

                    return this.activityService
                        .save({
                            generatedName: insight.title,
                            generatedTargetId: insight._id,
                            generatedClass: ReferenceClass.INSIGHT,
                            generatedSubClass: insight.insightType,
                            usedEntities,
                        })
                        .pipe(
                            map(() => insight),
                            catchError(err => {
                                console.error('Unable to create a provenance activity', err);
                                this.notificationService.error('Unable to create a provenance activity');
                                return of(<Insight>undefined);
                            })
                        );
                })
            )
            .subscribe(
                insight => {
                    this.newInsight.emit(insight);
                },
                err => {
                    console.error(err);
                    this.errors.newInsight = err.message;
                }
            );
    }
}
