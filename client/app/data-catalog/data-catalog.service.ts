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
import { DataCatalog } from '../../../shared/interfaces/data-catalog.model';
import { stringifyQuery } from '../../components/util';

@Injectable()
export class DataCatalogService {

    static parameters = [HttpClient];
    constructor(private httpClient: HttpClient) { }

    getDataCatalogs(query?: {}): Observable<DataCatalog[]> {
        return this.httpClient.get<DataCatalog[]>(`/api/data-catalogs${stringifyQuery(query)}`);
    }

    getDataCatalog(dataCatalogId: string): Observable<DataCatalog> {
        return this.httpClient.get<DataCatalog>(`/api/data-catalogs/${dataCatalogId}`);
    }

    searchDataCatalogsByName(terms: Observable<string>): Observable<DataCatalog[] | null> {
        return terms
            .pipe(
                debounceTime(400),
                distinctUntilChanged(),
                switchMap(term => term ? this.getDataCatalogs({ searchTerms: term }) : of(null))
            );
    }
}
