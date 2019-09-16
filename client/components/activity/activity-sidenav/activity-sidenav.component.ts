import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { combineLatest } from 'rxjs';
import { map, filter, tap, switchMap, take } from 'rxjs/operators';
import { flow, keyBy, mapValues, values } from 'lodash/fp';

import { Entity } from 'models/entities/entity.model';
import { User } from 'models/auth/user.model';
import { SecondarySidenavService } from 'components/sidenav/secondary-sidenav/secondary-sidenav.service';
import { SocketService } from 'components/socket/socket.service';
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
    private activityDirectionFilters: Filter[] = [];

    @ViewChild(ProvenanceGraphComponent, { static: false }) provenanceGraph: ProvenanceGraphComponent;
    private root: EntityOrUser;
    private provenanceGraphData: any;

    static parameters = [Router, SecondarySidenavService, ProvenanceService];
    constructor(
        private router: Router,
        private sidenavService: SecondarySidenavService,
        private provenanceService: ProvenanceService
    ) {}

    ngOnInit() {
        this.activityDirectionFilters = values(config.activityDirectionFilters);
        this.router.events.pipe(filter(event => event instanceof NavigationStart)).subscribe(_ => this.close());
    }

    ngAfterViewInit() {
        this.filters.changes
            .pipe(
                map(filters => filters.map((f: FiltersComponent) => f.getSelectedFilter())),
                take(1),
                switchMap(selectedFilters =>
                    combineLatest(...selectedFilters).pipe(
                        map(myFilters => flow([keyBy('group'), mapValues('value')])(myFilters))
                    )
                ),
                switchMap(direction => {
                    if (this.checkIfUser(this.root)) {
                        return (
                            // TODO Provenance: Add created_at, desc and 3 as default in config
                            this.provenanceService
                                .getProvenanceGraphByAgent(this.root._id, 'created_at', 'desc', 3)
                        );
                    } else {
                        return this.provenanceService.getProvenanceGraphByReference(
                            this.root._id,
                            direction.activityDirection,
                            'created_at',
                            'desc',
                            3
                        );
                    }
                })
            )
            .subscribe(activity => {
                this.provenanceGraphData = activity;
            });
    }

    setRoot(root: EntityOrUser): void {
        if (root) {
            if (this.checkIfUser(root)) {
                // TODO Provenance: Add created_at, desc and 3 as default in config
                this.provenanceService
                    .getProvenanceGraphByAgent(root._id, 'created_at', 'desc', 3)
                    .subscribe(activity => {
                        this.provenanceGraphData = activity;
                        this.root = root;
                    });
            } else {
                this.provenanceService
                    .getProvenanceGraphByReference(root._id, 'down', 'created_at', 'desc', 3)
                    .subscribe(activity => {
                        this.provenanceGraphData = activity;
                        this.root = root;
                    });
            }
        }
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
