import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { EntityService } from 'components/entity/entity.service';
import { stringifyQuery } from 'components/util';
import { DataCatalog } from 'models/entities/data-catalog.model';
import { Patch } from 'models/patch.model';
import { QueryListResponse } from 'models/query-list-response.model';
import { EntityAttachment } from 'models/entities/entity-attachment.model';
import { StringValue } from 'models/string-value.model';
import config from '../app.constants';

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

    isPublic(id: string): Observable<boolean> {
        // TODO Restore meaningful code when data catalogs fully support ACL
        // For now data catalogs are considered public
        return of(true);
        // return this.httpClient
            // .get<StringValue>(`/api/data-catalogs/${id}/visibility`)
            // .pipe(map(res => res.value === config.entityVisibility.PUBLIC.value));
    }

    makePublic(entity: DataCatalog): Observable<DataCatalog> {
        throw new Error('Method not implemented.');
    }

    makePrivate(entity: DataCatalog): Observable<DataCatalog> {
        throw new Error('Method not implemented.');
    }

    searchByTerms(terms: Observable<string>): Observable<QueryListResponse<DataCatalog>> {
        return terms.pipe(
            debounceTime(400),
            distinctUntilChanged(),
            switchMap(term => {
                if (term) {
                    return this.httpClient.get<QueryListResponse<DataCatalog>>(
                        `/api/data-catalogs?searchTerms=${term}`
                    );
                } else {
                    return of(null);
                }
            })
        );
    }

    getAttachments(entity: DataCatalog): Observable<EntityAttachment[]> {
        throw new Error('Method not implemented.');
    }

    createAttachments(dataCatalog: DataCatalog, attachments: EntityAttachment[]): Observable<EntityAttachment[]> {
        return this.httpClient.post<EntityAttachment[]>(
            `/api/data-catalogs/${dataCatalog._id}/attachments`,
            attachments
        );
    }

    removeAttachment(entity: DataCatalog, attachment: EntityAttachment): Observable<EntityAttachment> {
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
