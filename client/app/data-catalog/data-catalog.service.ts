import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EntityService } from 'components/entity/entity.service';
import { stringifyQuery } from 'components/util';
import { DataCatalog } from 'models/entities/data-catalog.model';
import { Patch } from 'models/patch.model';
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

    update(id: string, patches: Patch[]): Observable<DataCatalog> {
        return this.httpClient.patch<DataCatalog>(`/api/data-catalogs/${id}`, patches);
    }

    makePublic(entity: DataCatalog): Observable<DataCatalog> {
        throw new Error('Method not implemented.');
    }
    makePrivate(entity: DataCatalog): Observable<DataCatalog> {
        throw new Error('Method not implemented.');
    }
}
