import { Component, OnDestroy, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { flow, keyBy, mapValues, values, find, orderBy } from 'lodash/fp';
import { SecondarySidenavService } from 'components/sidenav/secondary-sidenav/secondary-sidenav.service';
import { SocketService } from 'components/socket/socket.service';
import { ProvenanceService } from 'components/provenance/provenance.service';
import { Entity } from 'models/entities/entity.model';
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
    private entity: Entity;
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
                this.provenanceService.getProvenanceGraphByReference(this.entity._id, direction.activityDirection, 'created_at', 'desc', 3)
                    .subscribe(activity => {
                        console.log(activity)
                        this.provenanceGraph = activity;
                    });
            })

    }

    ngOnDestroy() {
        this.socketService.unsyncUpdates(`activity:${this.entity._id}:entity`);
    }

    setEntity(entity: Entity): void {
        if (entity) {
            this.provenanceService.getProvenanceGraphByReference(entity._id, 'down', 'created_at', 'desc', 1)
                .subscribe(activity => {
                    this.provenanceGraph = activity;
                    this.entity = entity;
                });
        }
    }

    close(): void {
        this.sidenavService.close();
        this.sidenavService.destroyContentComponent();
    }
}
