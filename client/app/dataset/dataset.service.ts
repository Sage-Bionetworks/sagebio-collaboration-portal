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
import {
    CkanDatasetSearchResponse
} from '../../../shared/interfaces/ckan/ckan-dataset-search-response.model';
import { stringifyQuery } from '../../components/util';
import { DataCatalogService } from '../data-catalog/data-catalog.service';
import { DataCatalog } from '../../../shared/interfaces/data-catalog.model';

@Injectable()
export class DatasetService {

    static parameters = [HttpClient, DataCatalogService];
    constructor(private httpClient: HttpClient,
        private catalogService: DataCatalogService) { }

    searchDatasetsByCatalog(catalog: DataCatalog, searchTerms?: string,
        sort = 'metadata_created desc', limit = 4, page = 1): Observable<CkanDatasetSearchResponse> {
        var req = `${catalog.apiServerUrl}/action/package_search` +
            `?rows=${limit}` +
            `&sort=${sort}` +
            `&start=${(page - 1) * limit}` +
            (searchTerms ? `&fq=${searchTerms.split(' ')
                .map(term => `title:*${term}*`)
                .join(' +')}` : '');
        console.log('my query', req);
        return this.httpClient.get<CkanDatasetSearchResponse>(req);
    }

    getDataset(catalog: DataCatalog, datasetId: string): Observable<CkanDataset> {
        var req = `${catalog.apiServerUrl}/action/package_show?id=${datasetId}`;
        return this.httpClient.get<CkanDatasetResponse>(req)
            .pipe(
                map(res => res.result),
                tap(result => console.log('CKAN result', result))
            );
    }
}
