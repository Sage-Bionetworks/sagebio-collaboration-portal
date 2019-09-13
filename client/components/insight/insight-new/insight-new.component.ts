import { Component, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CaptureProvenanceActivityService } from 'components/provenance/capture-provenance-activity.service';
import { Insight } from 'models/entities/insights/insight.model';
import { Project } from 'models/entities/project.model';
import { ActivityClass } from 'models/provenance/activity.model';
import { InsightService } from '../insight.service';
import config from '../../../app/app.constants';
import { EntityAttachmentListComponent } from 'components/entity/entity-attachment/entity-attachment-list/entity-attachment-list.component';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
// import { EntityAttachments, EntityAttachmentMode } from 'models/entities/entity.model';

@Component({
    selector: 'insight-new',
    template: require('./insight-new.html'),
    styles: [require('./insight-new.scss')],
})
export class InsightNewComponent {
    @Input() project: Project;
    @Output() newInsight: EventEmitter<Insight> = new EventEmitter<Insight>();
    @Output() cancel: EventEmitter<any> = new EventEmitter<any>();

    private insightSpecs: any;
    private newForm: FormGroup;
    private errors = {
        newInsight: undefined,
    };

    @ViewChild(EntityAttachmentListComponent, { static: false }) attachments: EntityAttachmentListComponent<Insight>;

    static parameters = [FormBuilder, CaptureProvenanceActivityService, InsightService];
    constructor(
        private formBuilder: FormBuilder,
        private captureProvActivity: CaptureProvenanceActivityService,
        private insightService: InsightService
    ) {
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

        this.insightService.create(newInsight)
            .pipe(
                switchMap(insight => forkJoin({
                    insight: of(insight),
                    attachments: this.attachments.createAttachments(insight)
                }))
            )
        .subscribe(
            (res: any) => {
                let insight = res.insight;
                this.captureProvActivity.save({
                    generatedName: insight.title,
                    generatedTargetId: insight._id,
                    generatedClass: ActivityClass.INSIGHT,
                    generatedSubClass: insight.insightType,
                });
                this.newInsight.emit(insight);
            },
            err => {
                console.error(err);
                this.errors.newInsight = err.message;
            }
        );
    }
}
