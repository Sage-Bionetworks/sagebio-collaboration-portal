import { Component, OnDestroy, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { BehaviorSubject, Subscription, combineLatest } from 'rxjs';
import { map, take, switchMap } from 'rxjs/operators';
import { flow, keyBy, mapValues, values, find, orderBy } from 'lodash/fp';
import { SecondarySidenavService } from 'components/sidenav/secondary-sidenav/secondary-sidenav.service';
import { SocketService } from 'components/socket/socket.service';
import { ProvenanceService } from 'components/provenance/provenance.service';
import { Insight } from 'models/insights/insight.model';
import config from '../../../../client/app/app.constants';
import { Filter } from 'components/filters/filter.model';
import { FiltersComponent } from 'components/filters/filters.component';

@Component({
    selector: 'activity-sidenav',
    template: require('./activity-sidenav.html'),
    styles: [require('./activity-sidenav.scss')]
})
export class ActivitySidenavComponent implements OnDestroy, AfterViewInit {
    @ViewChildren(FiltersComponent) filters: QueryList<FiltersComponent>;
    private insight: Insight;
    // private activity: BehaviorSubject<Insight> = new BehaviorSubject<Insight>();
    private provenanceGraph: any;
    // // private states: State[];
    // // private reports: Insight[];
    // private insights: Insight[] = [];

    private activityDirectionFilters: Filter[] = [];


    static parameters = [SecondarySidenavService, ProvenanceService, SocketService];
    constructor(private sidenavService: SecondarySidenavService,
        private provenanceService: ProvenanceService,
        private socketService: SocketService) {
            this.activityDirectionFilters = values(config.activityDirectionFilters);

            // this.activity = this.provenanceService.getProvenanceGraph('created_at', 'desc', 1)
            //     .subscribe(graph => {
            //         this.provenanceGraph = graph;
            //     });
        }

    ngAfterViewInit() {
        let selectedFilters = this.filters.map(f => f.getSelectedFilter());
        combineLatest(...selectedFilters)
            .pipe(
                map(myFilters =>
                    flow([
                        keyBy('group'),
                        mapValues('value')
                    ])(myFilters)
                )
            )
            .subscribe(direction => {
                this.provenanceService.getProvenanceGraphByReference(this.insight._id, direction.activityDirection, 'created_at', 'desc', 1)
                    .subscribe(activity => {
                        // this.socketService.syncItemSubject(`activity:${insight._id}:insight`, this.activity);
                        this.provenanceGraph = activity;
                    });
            })
    }

    ngOnDestroy() {
        this.socketService.unsyncUpdates(`activity:${this.insight._id}:insight`);
    }

    setInsight(insight: Insight): void {
        if (insight) {
            this.provenanceService.getProvenanceGraphByReference(insight._id, 'down', 'created_at', 'desc', 1)
                .subscribe(activity => {
                    // this.socketService.syncItemSubject(`activity:${insight._id}:insight`, this.activity);
                    this.provenanceGraph = activity;
                    this.insight = insight;
                });
        }
    }

    close(): void {
        this.sidenavService.close();
        this.sidenavService.destroyContentComponent();
    }
}
