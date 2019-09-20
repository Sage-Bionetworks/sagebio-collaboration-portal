import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { combineLatest, BehaviorSubject, Observable } from 'rxjs';
import { map, filter, switchMap } from 'rxjs/operators';
import { flow, keyBy, mapValues, values } from 'lodash/fp';
import { Entity } from 'models/entities/entity.model';
import { User } from 'models/auth/user.model';
import { SecondarySidenavService } from 'components/sidenav/secondary-sidenav/secondary-sidenav.service';
import { Filter } from 'components/filters/filter.model';
import { FiltersComponent } from 'components/filters/filters.component';
import { ProvenanceService } from 'components/provenance/provenance.service';
import { ProvenanceGraphComponent } from 'components/provenance/provenance-graph/provenance-graph.component';
import { ResizedEvent } from 'components/directives/resized/resized-event';
import config from '../../../../client/app/app.constants';

type EntityOrUser = Entity | User;

@Component({
    selector: 'activity-sidenav',
    template: require('./activity-sidenav.html'),
    styles: [require('./activity-sidenav.scss')],
})
export class ActivitySidenavComponent implements OnInit, AfterViewInit {
    @ViewChildren(FiltersComponent) filters: QueryList<FiltersComponent>;
    private activityDirectionFilters: Filter[] = []; // used in html

    @ViewChild(ProvenanceGraphComponent, { static: false }) provenanceGraph: ProvenanceGraphComponent;
    private root: BehaviorSubject<EntityOrUser> = new BehaviorSubject<EntityOrUser>(undefined);
    private provenanceGraphData: any; // used in html

    static parameters = [Router, SecondarySidenavService, ProvenanceService];
    constructor(
        private router: Router,
        private sidenavService: SecondarySidenavService,
        private provenanceService: ProvenanceService
    ) {}

    ngOnInit() {
        this.activityDirectionFilters = [
            {
                value: 'down',
                title: 'Down',
                active: true,
            },
            {
                value: 'up',
                title: 'Up',
            },
        ];
        this.router.events.pipe(filter(event => event instanceof NavigationStart)).subscribe(_ => this.close());
    }

    ngAfterViewInit() {
        let selectedFilters = this.filters.map(f => f.getSelectedFilter());

        combineLatest(
            combineLatest(...selectedFilters).pipe(
                map(myFilters => flow([keyBy('group'), mapValues('value')])(myFilters))
            ),
            this.root.pipe(filter(root => !!root))
        )
            .pipe(
                switchMap(([query, root]) => {
                    if (this.checkIfUser(root)) {
                        return (
                            // TODO Provenance: Add created_at, desc and 3 as default in config
                            this.provenanceService.getProvenanceGraphByAgent(root._id, 'created_at', 'desc', 3)
                        );
                    } else {
                        return this.provenanceService.getProvenanceGraphByReference(
                            root._id,
                            query.activityDirection,
                            'created_at',
                            'desc',
                            3
                        );
                    }
                })
            )
            .subscribe(
                activity => {
                    this.provenanceGraphData = activity;
                },
                err => console.error(err)
            );
    }

    setRoot(root: EntityOrUser): void {
        this.root.next(root);
    }

    get root$(): Observable<EntityOrUser> {
        return this.root.asObservable();
    }

    checkIfUser(tbd: EntityOrUser): tbd is User {
        if ((tbd as User).username) {
            return true;
        }
        return false;
    }

    close(): void {
        this.sidenavService.close();
    }

    onResized(event: ResizedEvent) {
        if (this.provenanceGraph && event) {
            this.provenanceGraph.setDimentions(event.newWidth);
        }
    }
}
