import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ResourceService } from 'components/resource/resource.service';
// import { StateService } from '../../state/state.service';

import { Resource } from 'models/entities/resources/resource.model';

import { PageTitleService } from 'components/page-title/page-title.service';
import { NotificationService } from 'components/notification/notification.service';
import { switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import config from '../../../app/app.constants';
import { ObjectValidators } from 'components/validation/object-validators';

@Component({
    selector: 'resource-page',
    template: require('./resource-page.html'),
    styles: [require('./resource-page.scss')],
})
export class ResourcePageComponent implements OnInit, OnDestroy {
    @Output() resourceOutput = new EventEmitter<Resource>();
    private resource: Resource;
    private form: FormGroup;
    private errors = {
        updateDescription: undefined
    };

    static parameters = [Router, ActivatedRoute, FormBuilder, PageTitleService,
        ResourceService, NotificationService];
    constructor(private router: Router, private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private pageTitleService: PageTitleService,
        private resourceService: ResourceService,
        private notificationService: NotificationService) {

        this.form = formBuilder.group({
            description: ['', [
                // Validators.required,
                // ObjectValidators.jsonStringifyMinLength(config.models.resource.description.minlength),
                ObjectValidators.jsonStringifyMaxLength(config.models.resource.description.maxlength)
            ]]
        });

        this.route.params
            .pipe(
                switchMap(params => this.resourceService.getResource(params.resourceId))
            )
            .subscribe(resource => {
                if (resource.description) {  // TODO: should be required
                    try {
                        this.form.get('description').setValue(JSON.parse(resource.description));
                    } catch (e) {
                        // the description is likely a string if specified from a tool
                        this.form.get('description').setValue(JSON.parse(`{\"ops\":[{\"insert\":\"${resource.description}\"}]}`));
                    }
                }
                this.resource = resource;
                this.resourceOutput.emit(resource)
            });
    }

    ngOnInit() {
        this.form
            .controls
            .description
            .valueChanges.pipe(
                debounceTime(50),
                distinctUntilChanged()
            )
            .subscribe((data) => {
                console.log('RESOURCE', data);
                this.errors.updateDescription = undefined;
            });
    }

    ngOnDestroy() { }

    openInTool(resource): void {
        window.open(resource.data, '_blank');
    }

    open(): void {
        window.open(this.resource.url, '_blank');
    }

    updateDescription(): void {
        let description = JSON.stringify(this.form.get('description').value);
        // console.log('description', description);
        // console.log('DESCRIPTION', description);
        try {
            this.resourceService.updateResourceDescription(this.resource, description)
                .subscribe(resource => {
                    this.notificationService.info('The description has been successfully saved');
                }, err => {
                    console.log(err);
                    // this.errors.updateDescription = err.message;
                });
        } catch (e) { }
        // try {
        //     this.resourceService.updateStateDescription(this.resource, description)
        //         .subscribe(resource => {
        //             this.notificationService.info('The description has been successfully saved');
        //         }, err => {
        //             console.log(err);
        //             // this.errors.updateDescription = err.message;
        //         });
        // } catch (e) { }
    }

    showActivity(): void {
        this.resourceService.showActivity(this.resource);
    }
}
