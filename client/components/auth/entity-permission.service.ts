import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EntityPermission } from 'models/auth/entity-permission.model';
import { stringifyQuery } from 'components/util';

@Injectable()
export class EntityPermissionService {
    static parameters = [HttpClient];
    constructor(private httpClient: HttpClient) { }

    getMyPermissions(): Observable<EntityPermission[]> {
        return this.httpClient.get<EntityPermission[]>('/api/entity-permissions/mine');
    }

    // getPermissions(query?: {}): Observable<UserPermission[]> {
    //     return this.httpClient.get<UserPermission[]>(`/api/user-permissions${stringifyQuery(query)}`);
    // }
    //
    // addPermissions(body?: {}): Observable<UserPermission[]> {
    //     return this.httpClient.post<UserPermission[]>(`/api/user-permissions`, body);
    // }
    //
    // deletePermissions(entityID: String): Observable<UserPermission[]> {
    //     return this.httpClient.delete<UserPermission[]>(`/api/user-permissions/${entityID}`);
    // }
}
