import { Component, OnDestroy, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { flow, keyBy, mapValues, values, find, orderBy } from 'lodash/fp';
import { SecondarySidenavService } from 'components/sidenav/secondary-sidenav/secondary-sidenav.service';
import { SocketService } from 'components/socket/socket.service';
import { ProvenanceService } from 'components/provenance/provenance.service';
import { Entity } from 'models/entities/entity.model';
import { User } from 'models/auth/user.model';
import config from '../../../../client/app/app.constants';
import { Filter } from 'components/filters/filter.model';
import { FiltersComponent } from 'components/filters/filters.component';
import { ThenableWebDriver } from 'selenium-webdriver';

type EntityOrUser = Entity | User;

@Component({
    selector: 'activity-sidenav',
    template: require('./activity-sidenav.html'),
    styles: [require('./activity-sidenav.scss')]
})
export class ActivitySidenavComponent implements OnDestroy, AfterViewInit {
    @ViewChildren(FiltersComponent) filters: QueryList<FiltersComponent>;
    private root: EntityOrUser;
    private provenanceGraph: any;
    private activityDirectionFilters: Filter[] = [];

    static parameters = [SecondarySidenavService, ProvenanceService, SocketService];
    constructor(private sidenavService: SecondarySidenavService,
        private provenanceService: ProvenanceService,
        private socketService: SocketService) {
        this.activityDirectionFilters = values(config.activityDirectionFilters);
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
                if (this.checkIfUser(this.root)) {
                    this.provenanceService.getProvenanceGraphByAgent(this.root._id, 'created_at', 'desc', 3)
                        .subscribe(activity => {
                            console.log(activity);
                            this.provenanceGraph = activity;
                        });
                } else {
                    this.provenanceService
                        .getProvenanceGraphByReference(
                            this.root._id,
                            direction.activityDirection,
                            'created_at', 'desc', 3)
                        .subscribe(activity => {
                            console.log(activity);
                            this.provenanceGraph = activity;
                        });
                }
            });
    }

    ngOnDestroy() {
        this.socketService.unsyncUpdates(`activity:${this.root._id}:entity`);
    }

    setRoot(root: EntityOrUser): void {
        if (root) {
            if (this.checkIfUser(root)) {
                this.provenanceService.getProvenanceGraphByAgent(root._id, 'created_at', 'desc', 3)
                    .subscribe(activity => {
                        this.provenanceGraph = activity;
                        this.root = root;
                    });
            } else {
                this.provenanceService.getProvenanceGraphByReference(root._id, 'down', 'created_at', 'desc', 3)
                    .subscribe(activity => {
                        this.provenanceGraph = activity;
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
        this.sidenavService.destroyContentComponent();
    }
}
