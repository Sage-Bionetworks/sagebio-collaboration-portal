import { Component, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ResourceService } from 'components/resource/resource.service';
import { Resource } from 'models/entities/resources/resource.model';
import { PageTitleService } from 'components/page-title/page-title.service';
import config from '../../../app/app.constants';
import { CaptureProvenanceActivityService } from 'components/provenance/capture-provenance-activity.service';
import { ProjectDataService } from '../../../app/project/project-data.service';
import { Project } from 'models/project.model';


@Component({
    selector: 'resource-new',
    template: require('./resource-new.html'),
    styles: [require('./resource-new.scss')],
})
export class ResourceNewComponent {
    private resourceSpecs: {};
    private newForm: FormGroup;
    private errors = {
        newResource: undefined
    };
    private project: Project;

    @Output() newResource: EventEmitter<Resource> = new EventEmitter<Resource>();
    @Output() close: EventEmitter<any> = new EventEmitter<any>();

    static parameters = [Router, ActivatedRoute, FormBuilder, PageTitleService,
        ResourceService, CaptureProvenanceActivityService, ProjectDataService];
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private pageTitleService: PageTitleService,
        private resourceService: ResourceService,
        private captureProvActivity: CaptureProvenanceActivityService,
        private projectDataService: ProjectDataService) {

        this.resourceSpecs = config.models.resource;
        this.newForm = this.formBuilder.group({
            resourceType: [config.models.resource.type.default, [
                Validators.required
            ]],
            title: ['', [
                Validators.required,
                Validators.minLength(config.models.resource.title.minlength),
                Validators.maxLength(config.models.resource.title.maxlength)
            ]],
            description: ['', [
                Validators.required,
                Validators.minLength(config.models.resource.description.minlength),
                Validators.maxLength(config.models.resource.description.maxlength)
            ]],
        });

        this.projectDataService.project()
            .subscribe(project => {
                this.project = project;
            })
    }

    createNewResource(): void {
        let newResource = this.newForm.value;
        newResource.description = JSON.stringify(newResource.description);
        newResource.projectId = this.project._id
        this.resourceService.create(newResource)
            .subscribe(resource => {
                this.newResource.emit(resource);
                this.captureProvActivity.save({
                    generatedName: resource.title,
                    generatedTargetId: resource._id,
                    generatedClass: 'Resource',
                    generatedSubClass: resource.resourceType
                });
            }, err => {
                console.log(err);
                this.errors.newResource = err.message;
            });
    }
}
