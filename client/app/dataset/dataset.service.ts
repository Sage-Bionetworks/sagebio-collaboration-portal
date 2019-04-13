import { Injectable } from '@angular/core';
import { Observable, of, forkJoin, empty } from 'rxjs';
import {
    debounceTime,
    distinctUntilChanged,
    map,
    switchMap,
    tap,
    mergeMap,
    reduce,
    concatMap,
    toArray,
    expand
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
import { DataCatalogService } from '../data-catalog/data-catalog.service';
import { DataCatalog } from '../../../shared/interfaces/data-catalog.model';

@Injectable()
export class DatasetService {

    static parameters = [HttpClient, DataCatalogService];
    constructor(private httpClient: HttpClient,
        private catalogService: DataCatalogService) { }

    getDatasets(catalogs: DataCatalog[], query?: {}): Observable<CkanDataset[]> {
        const obs = catalogs.map(c => this.getDatasetsByCatalog(c));
        return forkJoin(obs, (...results) =>
            results.map((result, i) =>
                result.map(dataset => ({ ...dataset, catalog: catalogs[i] }))
            )
        )
            .pipe(
                map(datasetsArray => [].concat(...datasetsArray))
            );
        // return this.catalogService.getDataCatalogs()
        //     .pipe(
        //         concatMap(catalogs => {
        //             const obs = catalogs.map(c => this.getDatasetsByCatalog(c));
        //             return forkJoin(obs, (...results) =>
        //                 results.map((result, i) =>
        //                     result.map(dataset => ({ ...dataset, catalog: catalogs[i] }))
        //                 )
        //             );
        //         }),
        //         map(datasetsArray => [].concat(...datasetsArray)),
        //         tap(res => console.log('DATASETS', res))
        //     );
    }

    getDatasetsByCatalog(catalog: DataCatalog): Observable<CkanDataset[]> {
        return this.httpClient.get<CkanDatasetListResponse>(`${catalog.apiBaseUri}/action/current_package_list_with_resources`)
            .pipe(
                map(res => res.result)
            );
    }

    getAllDatasetsByCatalog(catalog: DataCatalog): Observable<CkanDataset[]> {
        return this.httpClient.get<CkanDatasetListResponse>(
            `${catalog.apiBaseUri}/action/current_package_list_with
                _resources?limit=1000`)  // TODO: would miss results if CKAN max limit is smaller
            .pipe(
                expand((res, i) => {
                    return res.result.length > 0 ?
                        this.httpClient.get<CkanDatasetListResponse>(
                            `${catalog.apiBaseUri}/action/current_package_list_
                              with_resources?limit=1000&page=${i + 2}`) :
                        empty();  // TODO: check if res is an array
                }),
                reduce((acc, data: CkanDatasetListResponse) => {
                    return acc.concat(data.result);
                }, []),
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

    // searchDatasetsByName(terms: Observable<string>): Observable<CkanDataset[] | null> {
    //     return terms
    //         .pipe(
    //             debounceTime(400),
    //             distinctUntilChanged(),
    //             switchMap(term => term ? this.getDatasets({ searchTerms: term }) : of(null))
    //         );
    // }
}
