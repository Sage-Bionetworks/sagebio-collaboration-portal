import { Component, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InsightService } from 'components/insight/insight.service';
import { Insight } from 'models/entities/insights/insight.model';
import { PageTitleService } from 'components/page-title/page-title.service';
import config from '../../../app/app.constants';
import { CaptureProvenanceActivityService } from 'components/provenance/capture-provenance-activity.service';
import { ProjectDataService } from '../../../app/project/project-data.service';
import { Project } from 'models/entities/project.model';
import { EntityAttachment } from 'models/entities/entity.model';


@Component({
    selector: 'insight-new',
    template: require('./insight-new.html'),
    styles: [require('./insight-new.scss')],
})
export class InsightNewComponent {
    private insightSpecs: {};
    private newForm: FormGroup;
    private errors = {
        newInsight: undefined
    };
    private project: Project;
    private attachments: EntityAttachment[];

    @Output() newInsight: EventEmitter<Insight> = new EventEmitter<Insight>();
    @Output() close: EventEmitter<any> = new EventEmitter<any>();

    static parameters = [Router, ActivatedRoute, FormBuilder, PageTitleService,
        InsightService, CaptureProvenanceActivityService, ProjectDataService];
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private pageTitleService: PageTitleService,
        private insightService: InsightService,
        private captureProvActivity: CaptureProvenanceActivityService,
        private projectDataService: ProjectDataService) {

        this.insightSpecs = config.models.insight;
        this.newForm = this.formBuilder.group({
            insightType: [config.models.insight.type.default, [
                Validators.required
            ]],
            title: ['', [
                Validators.required,
                Validators.minLength(config.models.insight.title.minlength),
                Validators.maxLength(config.models.insight.title.maxlength)
            ]],
            description: ['', [
                Validators.required,
                Validators.minLength(config.models.insight.description.minlength),
                Validators.maxLength(config.models.insight.description.maxlength)
            ]],
        });

        this.projectDataService.project()
            .subscribe(project => {
                this.project = project;
            });
    }

    createNewInsight(): void {
        let newInsight = this.newForm.value;
        newInsight.description = JSON.stringify(newInsight.description);
        newInsight.projectId = this.project._id;
        newInsight.attachments = this.attachments;

        this.insightService.create(newInsight)
            .subscribe(insight => {
                this.newInsight.emit(insight);
                this.captureProvActivity.save({
                    generatedName: insight.title,
                    generatedTargetId: insight._id,
                    generatedClass: 'Insight',
                    generatedSubClass: insight.insightType
                });
            }, err => {
                console.log(err);
                this.errors.newInsight = err.message;
            });
    }

    updateAttachments(attachments): void {
        // WIP updateAttachments needs to store new entity attachments
        this.attachments = attachments;
    }
}
