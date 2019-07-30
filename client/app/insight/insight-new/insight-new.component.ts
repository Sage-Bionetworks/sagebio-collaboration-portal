import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InsightService } from '../insight.service';
import { Insight } from 'models/entities/insights/insight.model';
import { PageTitleService } from 'components/page-title/page-title.service';
import { AppQuillEditorComponent } from 'components/quill/app-quill-editor/app-quill-editor.component';
import { Observable, forkJoin, combineLatest, of, empty, never } from 'rxjs';
import { filter, map, switchMap, tap, concatMap, mergeMap, catchError } from 'rxjs/operators';
import config from '../../app.constants';

@Component({
    selector: 'insight-new',
    template: require('./insight-new.html'),
    styles: [require('./insight-new.scss')],
})
export class InsightNewComponent implements OnInit, OnDestroy {
    private insightSpecs: {};
    private newForm: FormGroup;
    private errors = {
        newInsight: undefined
    };
    // private submitted = false;

    @Output() newInsight: EventEmitter<Insight> = new EventEmitter<Insight>();
    @Output() close: EventEmitter<any> = new EventEmitter<any>();

    static parameters = [Router, ActivatedRoute, FormBuilder, PageTitleService,
        InsightService];
    constructor(private router: Router, private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private pageTitleService: PageTitleService,
        private insightService: InsightService) {

        this.insightSpecs = config.models.insight;
        this.newForm = this.formBuilder.group({
            insightType: [config.models.insight.type.default, [
                Validators.required
            ]],
            title: ['', [
                Validators.required,
                Validators.minLength(config.models.insight.title.minlength),
                Validators.maxLength(config.models.insight.title.maxlength)
            ]],
            description: ['', [
                Validators.required,
                Validators.minLength(config.models.insight.description.minlength),
                Validators.maxLength(config.models.insight.description.maxlength)
            ]],
        });
        console.log('CONSTRUCTOR');
    }

    ngOnInit() {
        // this.pageTitleService.title = 'New Insight';
    }

    ngOnDestroy() { }

    createNewInsight(): void {
        let newInsight = this.newForm.value;
        newInsight.description = JSON.stringify(newInsight.description);
        this.insightService.create(newInsight)
            .subscribe(insight => {
                this.newInsight.emit(insight);
            }, err => {
                console.log(err);
                this.errors.newInsight = err.message;
            });
    }
}
