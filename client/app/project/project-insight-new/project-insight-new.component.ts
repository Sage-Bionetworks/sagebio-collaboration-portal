import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { InsightService } from 'components/insight/insight.service';
import { CaptureProvenanceActivityService } from 'components/provenance/capture-provenance-activity.service';
import { Project } from 'models/entities/project.model';
import { ActivityClass } from 'models/provenance/activity.model';
import { ProjectDataService } from '../../../app/project/project-data.service';
import config from '../../../app/app.constants';

@Component({
    selector: 'project-insight-new',
    template: require('./project-insight-new.html'),
    styles: [require('./project-insight-new.scss')],
})
export class ProjectInsightNewComponent {
    private project$: Observable<Project>; // used in html
    private insightSpecs: any;
    private newForm: FormGroup;
    private errors = {
        newInsight: undefined,
    };

    static parameters = [
        Router,
        FormBuilder,
        CaptureProvenanceActivityService,
        InsightService,
        ProjectDataService,
    ];
    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        private captureProvActivity: CaptureProvenanceActivityService,
        private insightService: InsightService,
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
                this.captureProvActivity.save({
                    generatedName: insight.title,
                    generatedTargetId: insight._id,
                    generatedClass: ActivityClass.INSIGHT,
                    generatedSubClass: insight.insightType,
                });
                this.router.navigate(['/projects', project._id, 'insights', insight._id]);
            },
            err => {
                console.error(err);
                this.errors.newInsight = err.message;
            }
        );
    }

    cancel(project: Project): void {
        if (project) {
            this.router.navigate(['/projects', project._id, 'insights']);
        }
    }
}
