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
import { CkanDataset } from '../../../shared/interfaces/ckan/ckan-dataset.model';
import {
    CkanDatasetListResponse
} from '../../../shared/interfaces/ckan/ckan-dataset-list-response.model';
import {
    CkanDatasetResponse
} from '../../../shared/interfaces/ckan/ckan-dataset-response.model';
import { stringifyQuery } from '../../components/util';
import { ckanApiBaseUrl } from '../app.constants';

@Injectable()
export class DatasetService {

    static parameters = [HttpClient];
    constructor(private httpClient: HttpClient) { }

    getDatasets(query?: {}): Observable<CkanDataset[]> {
        // return this.httpClient.get<Dataset[]>(`/api/datasets${stringifyQuery(query)}`);
        return this.httpClient.get<CkanDatasetListResponse>(`${ckanApiBaseUrl}/action/current_package_list_with_resources`)
            .pipe(
                map(res => res.result),
                tap(result => console.log('CKAN result', result))
            );
    }

    getDataset(datasetId: string): Observable<CkanDataset> {
        // return this.httpClient.get<CkanDataset>(`/api/datasets/${datasetId}`);
        return this.httpClient.get<CkanDatasetResponse>(`${ckanApiBaseUrl}/action/package_show?id=${datasetId}`)
            .pipe(
                map(res => res.result),
                tap(result => console.log('CKAN result', result))
            );
    }

    searchDatasetsByName(terms: Observable<string>): Observable<CkanDataset[] | null> {
        return terms
            .pipe(
                debounceTime(400),
                distinctUntilChanged(),
                switchMap(term => term ? this.getDatasets({ searchTerms: term }) : of(null))
            );
    }
}
