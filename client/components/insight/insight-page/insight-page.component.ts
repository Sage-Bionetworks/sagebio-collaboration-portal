import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Insight } from 'models/entities/insights/insight.model';
import { InsightService } from 'components/insight/insight.service';
import { PageTitleService } from 'components/page-title/page-title.service';
import { NotificationService } from 'components/notification/notification.service';
import { UserPermissionDataService, UserPermissions } from 'components/auth/user-permission-data.service';
import config from '../../../app/app.constants';

@Component({
    selector: 'insight-page',
    template: require('./insight-page.html'),
    styles: [require('./insight-page.scss')],
    encapsulation: ViewEncapsulation.None,
})
export class InsightPageComponent implements OnInit {
    private _insight: Insight;
    @Input() private canEdit = false;
    @Input() private canDelete = false;

    private form: FormGroup;
    private errors = {
        updateDescription: undefined,
    };
    private entityType: string;

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

    @Input()
    set insight(insight: Insight) {
        if (insight) {
            this._insight = insight;

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
        }
    }

    get insight(): Insight {
        return this._insight;
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
            this.insightService.remove(insight).subscribe(
                () => {
                    this.router.navigate(['..'], { relativeTo: this.route });
                    this.notificationService.info(`The ${this.entityType} has been successfully deleted.`);
                },
                err => {
                    console.error(err);
                    this.notificationService.error(`Unable to remove ${this.entityType}.`);
                }
            );
        }
    }
}
