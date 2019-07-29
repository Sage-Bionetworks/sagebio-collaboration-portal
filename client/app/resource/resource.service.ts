import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
    debounceTime,
    distinctUntilChanged,
    map,
    switchMap,
    tap
} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { stringifyQuery } from 'components/util';

import { Resource } from 'models/entities/resources/resource.model';
import { State } from 'models/entities/resources/state.model';
import { Dashboard } from 'models/entities/resources/dashboard.model';
import { SecondarySidenavService } from 'components/sidenav/secondary-sidenav/secondary-sidenav.service';
import { ActivitySidenavComponent } from 'components/activity/activity-sidenav/activity-sidenav.component';

@Injectable()
export class ResourceService {

    static parameters = [HttpClient, SecondarySidenavService];
    constructor(private httpClient: HttpClient,
        private secondarySidenavService: SecondarySidenavService) { }

    getResources(query?: {}): Observable<Resource[]> {
        return this.httpClient.get<Resource[]>(`/api/resources${stringifyQuery(query)}`);
    }

    getResource(resourceId: string): Observable<Resource> {
        return this.httpClient.get<Resource>(`/api/resources/${resourceId}`);
    }

    searchResourcesByName(terms: Observable<string>): Observable<Resource[] | null> {
        return terms
            .pipe(
                debounceTime(400),
                distinctUntilChanged(),
                switchMap(term => term ? this.getResources({ searchTerms: term }) : of(null))
            );
    }

    updateResourceDescription(resource: Resource, description: string): Observable<Resource> {
        return this.httpClient.patch<Resource>(`/api/resources/${resource._id}`,  // HACK
            [
                { op: 'replace', path: '/description', value: description }
            ]
        );
    }

    updateStateDescription(resource: Resource, description: string): Observable<Resource> {
        return this.httpClient.patch<Resource>(`/api/states/${resource._id}`,  // HACK
            [
                { op: 'replace', path: '/description', value: description }
            ]
        );
    }

    showActivity(resource: Resource): void {
        let sidenavContentId = `activity:${resource._id}`;
        if (this.secondarySidenavService.getContentId() !== sidenavContentId) {
            (<ActivitySidenavComponent>this.secondarySidenavService
                .loadContentComponent(ActivitySidenavComponent))
                .setEntity(resource);
            this.secondarySidenavService.setContentId(sidenavContentId);
        }
        this.secondarySidenavService.open();
    }
}
