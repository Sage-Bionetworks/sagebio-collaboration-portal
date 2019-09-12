import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

    remove(dataCatalog: DataCatalog): Observable<DataCatalog> {
        return this.httpClient.delete(`/api/data-catalogs/${dataCatalog._id}`).pipe(map(() => dataCatalog));
    }

    makePublic(entity: DataCatalog): Observable<DataCatalog> {
        throw new Error('Method not implemented.');
    }

    makePrivate(entity: DataCatalog): Observable<DataCatalog> {
        throw new Error('Method not implemented.');
    }

    // MODEL FUNCTIONS

    getEntitySubType(dataCatalog: DataCatalog): string {
        return null;
    }

    getRouterLink(dataCatalog: DataCatalog): string[] {
        return ['/data-catalogs', dataCatalog._id];
    }
}
