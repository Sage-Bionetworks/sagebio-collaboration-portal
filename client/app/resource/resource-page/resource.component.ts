import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

import { ResourceService } from '../resource.service';
// import { StateService } from '../../state/state.service';

import { Resource } from 'models/resources/resource.model';

import { PageTitleService } from 'components/page-title/page-title.service';
import { NotificationService } from 'components/notification/notification.service';
import { Observable, forkJoin, combineLatest, of, empty, never } from 'rxjs';
import { filter, map, switchMap, tap, concatMap, mergeMap, catchError, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import config from '../../app.constants';
import { ObjectValidators } from 'components/validation/object-validators';
import { AppQuillEditorComponent } from 'components/quill/app-quill-editor/app-quill-editor.component';

@Component({
    selector: 'resource',
    template: require('./resource.html'),
    styles: [require('./resource.scss')],
})
export class ResourceComponent implements OnInit, OnDestroy {
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
                switchMap(res => this.resourceService.getResource(res.id))
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
                console.log('INSIGHT', data);
                this.errors.updateDescription = undefined;
            });

        // this.route.params
        //     .pipe(
        //         mergeMap(res => {
        //             return combineLatest(
        //                 this.resourceService.getResource(res.id)
        //                     .pipe(
        //                         catchError(err => {
        //                             // console.log(err);
        //                             // this.notificationService.error('Unable to connect to Data Catalog');
        //                             return of(<Resource>{});
        //                         })
        //                     ),
        //
        //                 this.stateService.getState(res.id)
        //                     .pipe(
        //                         catchError(err => {
        //                             // console.log(err);
        //                             // this.notificationService.error('Unable to connect to Data Catalog');
        //                             return of(<Resource>{});
        //                         })
        //                     )
        //             );
        //         }),
        //         map(([resource, state]) => {
        //             // console.log()
        //             return (resource._id) ? resource : state;
        //         })
        //         // tap([resource, state] => {
        //         //     console.log('resource', resource);
        //         //     console.log('state', state);
        //         // })
        //     )
        //     .subscribe(resource => {
        //         console.log(resource);
        //         if (resource.description) {  // TODO: should be required
        //             try {
        //                 this.form.get('description').setValue(JSON.parse(resource.description));
        //             } catch (e) {
        //                 // the description is likely a string if specified from a tool
        //                 this.form.get('description').setValue(JSON.parse(`{\"ops\":[{\"insert\":\"${resource.description}\"}]}`));
        //             }
        //         }
        //         this.resource = resource;
        //     });
    }

    ngOnDestroy() { }

    openInFe(resource): void {
        window.open(resource.data, '_blank');
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
        try {
            this.resourceService.updateStateDescription(this.resource, description)
                .subscribe(resource => {
                    this.notificationService.info('The description has been successfully saved');
                }, err => {
                    console.log(err);
                    // this.errors.updateDescription = err.message;
                });
        } catch (e) { }
    }
}
