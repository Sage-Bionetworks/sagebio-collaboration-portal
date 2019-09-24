import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Project } from 'models/entities/project.model';
import { Resource } from 'models/entities/resources/resource.model';
import { PageTitleService } from 'components/page-title/page-title.service';
import { ResourceService } from 'components/resource/resource.service';
import { UrlValidators } from 'components/validation/url-validators';
import config from '../../../app/app.constants';

@Component({
    selector: 'resource-new',
    template: require('./resource-new.html'),
    styles: [require('./resource-new.scss')],
})
export class ResourceNewComponent implements OnInit {
    @Input() project: Project;
    @Output() newResource: EventEmitter<Resource> = new EventEmitter<Resource>();
    @Output() cancel: EventEmitter<any> = new EventEmitter<any>();

    private resourceSpecs: any;
    private toolOpts = []; // used in html
    private newForm: FormGroup;
    private errors = {
        newResource: undefined,
    };

    static parameters = [
        FormBuilder,
        PageTitleService,
        ResourceService,
    ];
    constructor(
        private formBuilder: FormBuilder,
        private pageTitleService: PageTitleService,
        private resourceService: ResourceService,
    )
    {
        this.resourceSpecs = config.models.resource;
        this.toolOpts = config.defaultTools;
        this.newForm = this.formBuilder.group({
            title: [
                '',
                [
                    Validators.required,
                    Validators.minLength(this.resourceSpecs.title.minlength),
                    Validators.maxLength(this.resourceSpecs.title.maxlength),
                ],
            ],
            description: [
                '',
                [
                    Validators.required,
                    Validators.minLength(this.resourceSpecs.description.minlength),
                    Validators.maxLength(this.resourceSpecs.description.maxlength),
                ],
            ],
            url: [
                '',
                [
                    Validators.required,
                    UrlValidators.http(),
                    UrlValidators.noTrailingSlash(),
                    Validators.minLength(this.resourceSpecs.url.minlength),
                    Validators.maxLength(this.resourceSpecs.url.maxlength),
                ],
            ],
            resourceType: [this.resourceSpecs.type.default.value, [Validators.required]],
        });
    }

    ngOnInit() {
        this.newForm.get('resourceType').valueChanges.subscribe(values => {
            if (values === config.resourceTypes.STATE.value) {
                this.newForm.addControl('tool', new FormControl('', Validators.required));
            } else {
                this.newForm.removeControl('tool');
            }
        });
    }

    createNewResource(): void {
        let newResource = this.newForm.value;
        newResource.description = JSON.stringify(newResource.description);
        newResource.projectId = this.project._id;

        this.resourceService.create(newResource).subscribe(
            resource => {
                this.newResource.emit(resource);
            },
            err => {
                console.error(err);
                this.errors.newResource = err.message;
            }
        );
    }
}
