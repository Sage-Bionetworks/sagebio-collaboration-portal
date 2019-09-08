import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActionPermission } from 'models/auth/action-permission.model';
import { stringifyQuery } from 'components/util';

@Injectable()
export class ActionPermissionService {
    static parameters = [HttpClient];
    constructor(private httpClient: HttpClient) { }

    /**
     * Returns the action-permissions of the current user.
     * @param query
     */
    index(): Observable<ActionPermission[]> {
        return this.httpClient.get<ActionPermission[]>(`/api/action-permissions`);
    }

    /**
     * Returns the action-permissions of the user specified.
     * @param userId
     */
    indexByUser(userId: string): Observable<ActionPermission[]> {
        return this.httpClient.get<ActionPermission[]>(`/api/action-permissions/users/${userId}`);
    }



    // addPermissions(body?: {}): Observable<ActionPermission[]> {
    //     return this.httpClient.post<ActionPermission[]>(`/api/action-permissions`, body);
    // }

    // deletePermissions(entityID: String): Observable<ActionPermission[]> {
    //     return this.httpClient.delete<ActionPermission[]>(`/api/action-permissions/${entityID}`);
    // }
}
