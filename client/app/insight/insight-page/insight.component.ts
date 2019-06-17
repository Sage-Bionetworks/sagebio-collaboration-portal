import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

import { QuillEditorComponent } from 'ngx-quill';

import { InsightService } from '../insight.service';
import { StateService } from '../../state/state.service';
import { Insight } from '../../../../shared/interfaces/insight.model';
import { PageTitleService } from '../../../components/page-title/page-title.service';
import { NotificationService } from '../../../components/notification/notification.service';
import { Observable, forkJoin, combineLatest, of, empty, never } from 'rxjs';
import { filter, map, switchMap, tap, concatMap, mergeMap, catchError, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import config from '../../app.constants';
import { AppQuillEditorToolbarComponent } from '../../../components/quill/app-quill-editor-toolbar/app-quill-editor-toolbar.component';
import { ObjectValidators } from '../../../components/validation/object-validators';

@Component({
    selector: 'insight',
    template: require('./insight.html'),
    styles: [require('./insight.scss')],
})
export class InsightComponent implements OnInit, OnDestroy {
    private insight: Insight;
    @ViewChild('editor', { static: false }) editor: QuillEditorComponent;
    private hide = false;
    private form: FormGroup;
    private errors = {
        updateDescription: undefined
    };

    static parameters = [Router, ActivatedRoute, FormBuilder, PageTitleService,
        InsightService, StateService, NotificationService];
    constructor(private router: Router, private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private pageTitleService: PageTitleService,
        private insightService: InsightService,
        private stateService: StateService,
        private notificationService: NotificationService) {

        this.form = formBuilder.group({
            description: ['', [
                Validators.required,
                ObjectValidators.jsonStringifyMinLength(config.models.insight.description.minlength),
                ObjectValidators.jsonStringifyMaxLength(config.models.insight.description.maxlength)
            ]]
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
                this.errors.updateDescription = undefined;
            });

        this.route.params
            .pipe(
                mergeMap(res => {
                    return combineLatest(
                        this.insightService.getInsight(res.id)
                            .pipe(
                                catchError(err => {
                                    // console.log(err);
                                    // this.notificationService.error('Unable to connect to Data Catalog');
                                    return of(<Insight>{});
                                })
                            ),

                        this.stateService.getState(res.id)
                            .pipe(
                                catchError(err => {
                                    // console.log(err);
                                    // this.notificationService.error('Unable to connect to Data Catalog');
                                    return of(<Insight>{});
                                })
                            )
                    );
                }),
                map(([insight, state]) => {
                    // console.log()
                    return (insight._id) ? insight : state;
                })
                // tap([insight, state] => {
                //     console.log('insight', insight);
                //     console.log('state', state);
                // })
            )
            .subscribe(insight => {
                console.log(insight);
                if (insight.description) {  // TODO: should be required
                    try {
                        this.form.get('description').setValue(JSON.parse(insight.description));
                    } catch(e) {
                        // the description is likely a string if specified from a tool
                        this.form.get('description').setValue(JSON.parse(`{\"ops\":[{\"insert\":\"${insight.description}\"}]}`));
                    }
                }
                this.insight = insight;
            });
    }

    ngOnDestroy() { }

    openInFe(insight): void {
        window.open(insight.data, '_blank');
    }

    updateDescription(): void {
        let description = JSON.stringify(this.form.get('description').value);
        console.log('DESCRIPTION', description);
        try {
          this.insightService.updateInsightDescription(this.insight, description)
              .subscribe(insight => {
                  this.notificationService.info('The description has been successfully saved');
              }, err => {
                  console.log(err);
                  // this.errors.updateDescription = err.message;
              });
        } catch (e) {}
        try {
          this.insightService.updateStateDescription(this.insight, description)
              .subscribe(insight => {
                  this.notificationService.info('The description has been successfully saved');
              }, err => {
                  console.log(err);
                  // this.errors.updateDescription = err.message;
              });
        } catch (e) {}

    }
}
