import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserPermission } from 'models/auth/user-permission.model';

@Injectable()
export class UserPermissionService {
    static parameters = [HttpClient];
    constructor(private httpClient: HttpClient) { }

    getMyPermissions(): Observable<UserPermission[]> {
        return this.httpClient.get<UserPermission[]>('/api/user-permissions/mine');
    }
    upsertPermissionsByUserId(id: String, body: Array<Object>): Observable<UserPermission[]> {
        return this.httpClient.put<UserPermission[]>('/api/user-permissions/'+id, body);
    }
}
