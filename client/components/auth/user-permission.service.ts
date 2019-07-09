import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserPermission } from 'models/auth/user-permission.model';
import { stringifyQuery } from 'components/util';

@Injectable()
export class UserPermissionService {
    static parameters = [HttpClient];
    constructor(private httpClient: HttpClient) { }

    getMyPermissions(): Observable<UserPermission[]> {
        return this.httpClient.get<UserPermission[]>('/api/user-permissions/mine');
    }

    getPermissions(query?: {}): Observable<UserPermission[]> {
        return this.httpClient.get<UserPermission[]>(`/api/user-permissions${stringifyQuery(query)}`);
    }

    addPermissions(body?: {}): Observable<UserPermission[]> {
        return this.httpClient.post<UserPermission[]>(`/api/user-permissions`, body);
    }

    deletePermissions(entityID: String): Observable<UserPermission[]> {
        return this.httpClient.delete<UserPermission[]>(`/api/user-permissions/${entityID}`);
    }
}
