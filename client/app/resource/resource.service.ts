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

import { Resource } from 'models/resources/resource.model';
import { State } from 'models/resources/state.model';
import { Dashboard } from 'models/resources/dashboard.model';

@Injectable()
export class ResourceService {

    static parameters = [HttpClient];
    constructor(private httpClient: HttpClient) { }

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
}
