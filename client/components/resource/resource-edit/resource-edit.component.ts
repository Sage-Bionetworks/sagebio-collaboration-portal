import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Resource } from 'models/entities/resources/resource.model';
import { ResourceService } from '../resource.service';
import config from '../../../app/app.constants';
import { map } from 'lodash';
import { NotificationService } from 'components/notification/notification.service';
import { UrlValidators } from 'components/validation/url-validators';

@Component({
    selector: 'resource-edit',
    template: require('./resource-edit.html'),
    styles: [require('./resource-edit.scss')],
})
export class ResourceEditComponent implements OnInit {
    @Input() resource: Resource;
    @Output() resourceEdit: EventEmitter<Resource> = new EventEmitter<Resource>();
    @Output() cancel: EventEmitter<any> = new EventEmitter<any>();

    private resourceSpecs: any;
    private editForm: FormGroup;
    private errors = {
        editResource: undefined,
    };

    private toolOpts = []; // TODO get from backend

    static parameters = [FormBuilder, ResourceService, NotificationService];
    constructor(
        private formBuilder: FormBuilder,
        private resourceService: ResourceService,
        private notificationService: NotificationService
    ) {
        this.resourceSpecs = config.models.resource;
        this.toolOpts = config.defaultTools;
        this.editForm = this.formBuilder.group({
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
        if (this.resource) {
            this.editForm.setValue({
                title: this.resource.title,
                description: JSON.parse(this.resource.description),
                resourceType: this.resource.resourceType,
                url: this.resource.url
            });
            this.editForm.markAllAsTouched();
        }
    }

    updateResource(): void {
        this.notificationService.info('No implemented yet');
        // let editedResource = this.editForm.value;
        // // editedTool.slug = slugify(this.editForm.value.name).toLowerCase();
        // const patches = map(editedResource, (value, key) => ({
        //     op: 'replace',
        //     path: `/${key}`,
        //     value: value,
        // }));

        // // need to convert the quill-based description
        // let patchIndex = patches.findIndex(patch => patch.path === '/description');
        // patches[patchIndex].value = JSON.stringify(patches[patchIndex].value);

        // this.resourceService.update(this.resource._id, patches).subscribe(
        //     resource => {
        //         console.log('INSIGHT RECEIVED', resource);
        //         this.resourceEdit.emit(resource);
        //         this.cancel.emit(null);
        //     },
        //     err => {
        //         console.error(err);
        //         this.errors.editResource = err.message || err;
        //     }
        // );
    }
}
