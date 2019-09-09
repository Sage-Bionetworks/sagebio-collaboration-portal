import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { InsightService } from 'components/insight/insight.service';
// import { StateService } from '../../state/state.service';

import { Insight } from 'models/entities/insights/insight.model';

import { PageTitleService } from 'components/page-title/page-title.service';
import { NotificationService } from 'components/notification/notification.service';
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
    private insight: Insight;
    private form: FormGroup;
    private errors = {
        updateDescription: undefined
    };

    static parameters = [Router, ActivatedRoute, FormBuilder, PageTitleService, InsightService, NotificationService];
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private pageTitleService: PageTitleService,
        private insightService: InsightService,
        private notificationService: NotificationService) {

        this.form = formBuilder.group({
            description: ['', [
                // Validators.required,
                // ObjectValidators.jsonStringifyMinLength(config.models.insight.description.minlength),
                ObjectValidators.jsonStringifyMaxLength(config.models.insight.description.maxlength)
            ]]
        });

        this.route.params
            .pipe(
                switchMap(params => this.insightService.getInsight(params.insightId))
            )
            .subscribe(insight => {
                if (insight.description) {  // TODO: should be required
                    try {
                        this.form.get('description').setValue(JSON.parse(insight.description));
                    } catch (e) {
                        // the description is likely a string if specified from a tool
                        this.form.get('description').setValue(JSON.parse(`{\"ops\":[{\"insert\":\"${insight.description}\"}]}`));
                    }
                }
                this.insight = insight;
                this.insightOutput.emit(insight);
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
    }

    ngOnDestroy() { }

    updateDescription(): void {
        let description = JSON.stringify(this.form.get('description').value);
        // console.log('description', description);
        // console.log('DESCRIPTION', description);
        try {
            this.insightService.updateInsightDescription(this.insight, description)
                .subscribe(insight => {
                    this.notificationService.info('The description has been successfully saved');
                }, err => {
                    console.log(err);
                    // this.errors.updateDescription = err.message;
                });
        } catch (e) { }
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

    shareInsight(): void {
        this.insightService.shareInsight(this.insight, config.entityTypes.INSIGHT.value);
    }
}
