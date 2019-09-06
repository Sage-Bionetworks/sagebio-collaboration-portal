import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { DataCatalog } from 'models/entities/data-catalog.model';
import { stringifyQuery } from 'components/util';
import { head, orderBy } from 'lodash/fp';
import { EntityService } from 'components/entity/entity.service';
import { QueryListResponse } from 'models/query-list-response.model';

@Injectable()
export class DataCatalogService implements EntityService<DataCatalog> {
    static parameters = [HttpClient];
    constructor(private httpClient: HttpClient) {}

    query(query?: {}): Observable<QueryListResponse<DataCatalog>> {
        return this.httpClient.get<QueryListResponse<DataCatalog>>(`/api/data-catalogs${stringifyQuery(query)}`);
    }

    get(id: string): Observable<DataCatalog> {
        return this.httpClient.get<DataCatalog>(`/api/data-catalogs/${id}`);
    }

    getBySlug(slug: string): Observable<DataCatalog> {
        throw new Error('Method not implemented.');
    }

    create(catalog: DataCatalog): Observable<DataCatalog> {
        return this.httpClient.post<DataCatalog>('/api/data-catalogs', catalog);
    }

    makePublic(entity: DataCatalog): Observable<DataCatalog> {
        throw new Error('Method not implemented.');
    }
    makePrivate(entity: DataCatalog): Observable<DataCatalog> {
        throw new Error('Method not implemented.');
    }

    // FUNCTIONS TO REVIEW

    getDataCatalogBySlug(slug: string): Observable<DataCatalog> {
        return this.getDataCatalogs({ slug: slug }).pipe(map(catalogs => head(catalogs)));
    }

    getDataCatalogs(query?: {}): Observable<DataCatalog[]> {
        return this.httpClient
            .get<DataCatalog[]>(`/api/data-catalogs${stringifyQuery(query)}`)
            .pipe(map(catalogs => orderBy('title', 'asc', catalogs)));
    }

    getDataCatalog(dataCatalogId: string): Observable<DataCatalog> {
        return this.httpClient.get<DataCatalog>(`/api/data-catalogs/${dataCatalogId}`);
    }

    searchDataCatalogsByName(terms: Observable<string>): Observable<DataCatalog[] | null> {
        return terms.pipe(
            debounceTime(400),
            distinctUntilChanged(),
            switchMap(term => (term ? this.getDataCatalogs({ searchTerms: term }) : of(null)))
        );
    }
}
