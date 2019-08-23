import { Component, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ProvenanceService } from 'components/provenance/provenance.service';
import { Activity } from 'models/provenance/activity.model';
import { PageTitleService } from 'components/page-title/page-title.service';
import config from '../../../app/app.constants';
import { ProjectDataService } from '../../../app/project/project-data.service';
import { Project } from 'models/entities/project.model';

@Component({
    selector: 'activity-new',
    template: require('./activity-new.html'),
    styles: [require('./activity-new.scss')],
})
export class ActivityNewComponent {
    private activitySpecs: {};
    private newForm: FormGroup;
    private errors = {
        newActivity: undefined
    };
    private project: Project;

    @Output() newActivity: EventEmitter<Activity> = new EventEmitter<Activity>();
    @Output() close: EventEmitter<any> = new EventEmitter<any>();

    static parameters = [Router, ActivatedRoute, FormBuilder, PageTitleService,
        ProvenanceService, ProjectDataService];
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private pageTitleService: PageTitleService,
        private provenanceService: ProvenanceService,
        private projectDataService: ProjectDataService) {

        this.activitySpecs = config.models.activity;
        this.newForm = this.formBuilder.group({
            activityType: [config.models.activity.type.default, [
                Validators.required
            ]],
            title: ['', [
                Validators.required,
                Validators.minLength(config.models.activity.title.minlength),
                Validators.maxLength(config.models.activity.title.maxlength)
            ]],
            used: ['', [
                Validators.required
            ]],
            generated: ['', [
                Validators.required
            ]],
            description: ['', [
                Validators.required,
                Validators.minLength(config.models.activity.description.minlength),
                Validators.maxLength(config.models.activity.description.maxlength)
            ]],
        });

        this.projectDataService.project()
            .subscribe(project => {
                this.project = project;
            });
    }

    createNewActivity(): void {
        let currentUser = {
            _id: '5cb7acea2d718614d81bb97f',
            name: 'Admin'
        }
        let currentUsed = [{
            name: this.newForm.value.used,
            targetId: this.newForm.value.used,
            targetVersionId: '1',
            class: 'Resource',
            subclass: 'State'
        }]
        let currentGenerated = [{
            name: this.newForm.value.generated,
            targetId: this.newForm.value.generated,
            targetVersionId: '1',
            class: 'Insight',
            subclass: 'Report'
        }]
        let currentAgents = [{
            userId: currentUser._id,
            name: currentUser.name,
        }]
        let currentDescription = JSON.stringify(this.newForm.value.description);
        let newActivity = {
            name: this.newForm.value.title,
            class: this.newForm.value.activityType,
            used: currentUsed,
            generated: currentGenerated,
            agents: currentAgents,
            description: currentDescription
        }
        console.log('ACTIVITY', newActivity);
        this.provenanceService.createProvenanceActivity(newActivity)
            .subscribe(activity => {
                this.newActivity.emit(activity);
            }, err => {
                console.log(err);
                this.errors.newActivity = err.message;
            });
    }
}
