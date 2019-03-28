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
import { Dataset } from '../../../shared/interfaces/dataset.model';
import {
  CkanDatasetListResponse
} from '../../../shared/interfaces/ckan/ckan-dataset-list-response.model';
import { stringifyQuery } from '../../components/util';
import { ckanApiBaseUrl } from '../app.constants';

@Injectable()
export class DatasetService {

    static parameters = [HttpClient];
    constructor(private httpClient: HttpClient) { }

    getDatasets(query?: {}): Observable<Dataset[]> {
        // return this.httpClient.get<Dataset[]>(`/api/datasets${stringifyQuery(query)}`);
        return this.httpClient.get<CkanDatasetListResponse>(`${ckanApiBaseUrl}/action/current_package_list_with_resources`)
            .pipe(
                map((res: CkanDatasetListResponse) => res.result),
                tap(result => console.log('CKAN result', result))
        );
        return of(null);
    }

    getDataset(datasetId: string): Observable<Dataset> {
        return this.httpClient.get<Dataset>(`/api/datasets/${datasetId}`);
    }

    searchDatasetsByName(terms: Observable<string>): Observable<Dataset[] | null> {
        return terms
            .pipe(
                debounceTime(400),
                distinctUntilChanged(),
                switchMap(term => term ? this.getDatasets({ searchTerms: term }) : of(null))
            );
    }
}
