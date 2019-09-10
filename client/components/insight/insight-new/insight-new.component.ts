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
import { Observable } from 'rxjs';

@Component({
    selector: 'insight-new',
    template: require('./insight-new.html'),
    styles: [require('./insight-new.scss')],
})
export class InsightNewComponent {
    private project$: Observable<Project>;
    private insightSpecs: any;
    private newForm: FormGroup;
    private errors = {
        newInsight: undefined,
    };

    @Output() newInsight: EventEmitter<Insight> = new EventEmitter<Insight>();
    @Output() close: EventEmitter<any> = new EventEmitter<any>();

    static parameters = [
        Router,
        ActivatedRoute,
        FormBuilder,
        PageTitleService,
        InsightService,
        CaptureProvenanceActivityService,
        ProjectDataService,
    ];
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private pageTitleService: PageTitleService,
        private insightService: InsightService,
        private captureProvActivity: CaptureProvenanceActivityService,
        private projectDataService: ProjectDataService
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

        this.project$ = this.projectDataService.project();
    }

    createNewInsight(project: Project): void {
        let newInsight = this.newForm.value;
        newInsight.description = JSON.stringify(newInsight.description);
        newInsight.projectId = project._id;

        this.insightService.create(newInsight).subscribe(
            insight => {
                this.newInsight.emit(insight);
                this.captureProvActivity.save({
                    generatedName: insight.title,
                    generatedTargetId: insight._id,
                    generatedClass: 'Insight', // TODO Use enum
                    generatedSubClass: insight.insightType,
                });
            },
            err => {
                console.error(err);
                this.errors.newInsight = err.message;
            }
        );
    }
}
