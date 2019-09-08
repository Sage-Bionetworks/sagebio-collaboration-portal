import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActionPermission } from 'models/auth/action-permission.model';
import { map } from 'rxjs/operators';

@Injectable()
export class ActionPermissionService {
    static parameters = [HttpClient];
    constructor(private httpClient: HttpClient) {}

    /**
     * Returns the action-permissions of the current user.
     * @param query
     */
    query(): Observable<ActionPermission[]> {
        return this.httpClient.get<ActionPermission[]>(`/api/action-permissions`);
    }

    /**
     * Returns the action-permissions of the user specified.
     * @param userId
     */
    queryByUser(userId: string): Observable<ActionPermission[]> {
        return this.httpClient.get<ActionPermission[]>(`/api/action-permissions/users/${userId}`);
    }

    /**
     * Creates a new action-permission.
     * @param actionPermission
     */
    create(actionPermission: ActionPermission): Observable<ActionPermission> {
        return this.httpClient.post<ActionPermission>(`/api/action-permissions`, actionPermission);
    }

    /**
     * Deletes an action-permission.
     * @param actionPermission
     */
    delete(actionPermission: ActionPermission): Observable<ActionPermission> {
        return this.httpClient
            .delete<ActionPermission>(`/api/action-permissions/${actionPermission._id}`)
            .pipe(map(() => actionPermission));
    }
}
