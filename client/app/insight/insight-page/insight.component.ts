import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { InsightService } from '../insight.service';
import { StateService } from '../../state/state.service';
import { Insight } from '../../../../shared/interfaces/insight.model';
import { PageTitleService } from '../../../components/page-title/page-title.service';
import { NotificationService } from '../../../components/notification/notification.service';
import { NgxMdService } from 'ngx-md';
import { Observable, forkJoin, combineLatest, of, empty, never } from 'rxjs';
import { filter, map, switchMap, tap, concatMap, mergeMap, catchError } from 'rxjs/operators';

@Component({
    selector: 'insight',
    template: require('./insight.html'),
    styles: [require('./insight.scss')],
})
export class InsightComponent implements OnInit, OnDestroy {
    private insight: Insight;

    static parameters = [Router, ActivatedRoute, PageTitleService,
        InsightService, StateService, NotificationService];
    constructor(private router: Router, private route: ActivatedRoute,
        private pageTitleService: PageTitleService,
        private insightService: InsightService,
        private stateService: StateService,
        private notificationService: NotificationService) { }

    ngOnInit() {

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
                this.insight = insight;
            });


        // combineLatest(
        //     this.insightService.getInsight()
        // )


        // this.route.params.subscribe(res => {
        //     this.insightService.getInsight(res.id).subscribe(insight => {
        //         this.pageTitleService.title = insight.name;
        //         this.insight = insight;
        //     });
        // });
    }

    ngOnDestroy() { }

    // openCkan(insight: Insight): void {
    //     console.log('Not implemented.');
    // }
    //
    // openFacileExplorer(insight: Insight): void {
    //     console.log('Not implemented');
    // }
}
