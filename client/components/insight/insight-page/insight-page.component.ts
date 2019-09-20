import { Component, OnInit, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { InsightService } from 'components/insight/insight.service';
// import { StateService } from '../../state/state.service';
import { UserPermissionDataService, UserPermissions } from 'components/auth/user-permission-data.service';

// import { EntityAttachmentMode } from 'models/entities/entity.model';
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
    encapsulation: ViewEncapsulation.None,
})
export class InsightPageComponent implements OnInit {
    private insight: Insight;
    private form: FormGroup;
    private errors = {
        updateDescription: undefined,
    };
    private entityType: string;

    private isAdmin = false;
    private userPermissionsSub: Subscription;
    private permissions: Observable<UserPermissions>;

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
        this.entityType = config.entityTypes.INSIGHT.value;
        this.form = formBuilder.group({
            description: ['', []],
        });

        this.router.routeReuseStrategy.shouldReuseRoute = function() {
            return false;
        };

        this.userPermissionsSub = this.userPermissionDataService.permissions().subscribe(
            userPermissions => {
                this.isAdmin = userPermissions.isAdmin();

                // TODO: Apply permissions so that users other than Admin can edit
                // if (this.isAdmin) {
                //     this.mode = EntityAttachmentMode.EDIT;
                // }
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

    getLink(): string {
        return window.location.href;
    }

    onInsightEdit(insight: Insight): void {
        if (insight) {
            this.insight = insight;
            this.form.setValue({
                description: JSON.parse(this.insight.description),
            });
        }
    }

    deleteInsight(insight: Insight): void {
        if (insight) {
            this.notificationService.info('Not implemented');
        }
    }
}
