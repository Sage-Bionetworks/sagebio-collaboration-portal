import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { InsightService } from 'components/insight/insight.service';
// import { StateService } from '../../state/state.service';
import { UserPermissionDataService, UserPermissions } from 'components/auth/user-permission-data.service';

import { EntityAttachmentMode } from 'models/entities/entity.model';
import { Insight } from 'models/entities/insights/insight.model';

import { PageTitleService } from 'components/page-title/page-title.service';
import { NotificationService } from 'components/notification/notification.service';
import { Observable, Subscription } from 'rxjs';
import { switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import config from '../../../app/app.constants';
import { ObjectValidators } from 'components/validation/object-validators';

@Component({
    selector: 'insight-page',
    template: require('./insight-page.html'),
    styles: [require('./insight-page.scss')],
})
export class InsightPageComponent implements OnInit, OnDestroy {
    @Output() insightOutput = new EventEmitter<Insight>();
    private isAdmin = false;
    private mode = EntityAttachmentMode.DISPLAY;
    private userPermissionsSub: Subscription;
    private permissions: Observable<UserPermissions>;
    private insight: Insight;
    private form: FormGroup;
    private errors = {
        updateDescription: undefined,
    };
    private entityType = config.entityTypes.INSIGHT.value

    static parameters = [
        Router,
        ActivatedRoute,
        FormBuilder,
        PageTitleService,
        InsightService,
        NotificationService,
        UserPermissionDataService,
    ];

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private pageTitleService: PageTitleService,
        private insightService: InsightService,
        private notificationService: NotificationService,
        private userPermissionDataService: UserPermissionDataService
    ) {
        this.form = formBuilder.group({
            description: [
                '',
                [
                    // Validators.required,
                    // ObjectValidators.jsonStringifyMinLength(config.models.insight.description.minlength),
                    ObjectValidators.jsonStringifyMaxLength(config.models.insight.description.maxlength),
                ],
            ],
        });

        this.userPermissionsSub = this.userPermissionDataService.permissions().subscribe(
            userPermissions => {
                this.isAdmin = userPermissions.isAdmin();

                // TODO: Apply permissions so that users other than Admin can edit
                if (this.isAdmin) {
                    this.mode = EntityAttachmentMode.EDIT;
                }
            },
            err => console.log(err)
        );

        this.route.params
            .pipe(switchMap(params => this.insightService.getInsight(params.insightId)))
            .subscribe(insight => {
                if (insight.description) {
                    // TODO: should be required
                    try {
                        this.form.get('description').setValue(JSON.parse(insight.description));
                    } catch (e) {
                        // the description is likely a string if specified from a tool
                        this.form
                            .get('description')
                            .setValue(JSON.parse(`{\"ops\":[{\"insert\":\"${insight.description}\"}]}`));
                    }
                }
                this.insight = insight;
                this.insightOutput.emit(insight);
            });
    }

    ngOnInit() {
        this.form.controls.description.valueChanges
            .pipe(
                debounceTime(50),
                distinctUntilChanged()
            )
            .subscribe(data => {
                this.errors.updateDescription = undefined;
            });
    }

    ngOnDestroy() {}

    updateDescription(): void {
        let description = JSON.stringify(this.form.get('description').value);
        // console.log('description', description);
        // console.log('DESCRIPTION', description);
        try {
            this.insightService.updateInsightDescription(this.insight, description).subscribe(
                insight => {
                    this.notificationService.info('The description has been successfully saved');
                },
                err => {
                    console.log(err);
                    // this.errors.updateDescription = err.message;
                }
            );
        } catch (e) {}
        // try {
        //     this.insightService.updateStateDescription(this.insight, description)
        //         .subscribe(insight => {
        //             this.notificationService.info('The description has been successfully saved');
        //         }, err => {
        //             console.log(err);
        //             // this.errors.updateDescription = err.message;
        //         });
        // } catch (e) { }
    }

    showActivity(): void {
        this.insightService.showActivity(this.insight);
    }
}
