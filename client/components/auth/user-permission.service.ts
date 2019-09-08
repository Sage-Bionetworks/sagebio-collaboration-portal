import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActionPermission } from 'models/auth/action-permission.model';
import { stringifyQuery } from 'components/util';

@Injectable()
export class ActionPermissionService {
    static parameters = [HttpClient];
    constructor(private httpClient: HttpClient) { }

    getMyPermissions(): Observable<ActionPermission[]> {
        return this.httpClient.get<ActionPermission[]>('/api/action-permissions/mine');
    }

    getPermissions(query?: {}): Observable<ActionPermission[]> {
        return this.httpClient.get<ActionPermission[]>(`/api/action-permissions${stringifyQuery(query)}`);
    }

    addPermissions(body?: {}): Observable<ActionPermission[]> {
        return this.httpClient.post<ActionPermission[]>(`/api/action-permissions`, body);
    }

    deletePermissions(entityID: String): Observable<ActionPermission[]> {
        return this.httpClient.delete<ActionPermission[]>(`/api/action-permissions/${entityID}`);
    }
}
