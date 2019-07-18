import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Entity } from 'models/entity.model';
import { EntityPermission } from 'models/auth/entity-permission.model';
import { stringifyQuery } from 'components/util';

@Injectable()
export class EntityPermissionService {
    static parameters = [HttpClient];
    constructor(private httpClient: HttpClient) { }

    queryMine(): Observable<EntityPermission[]> {
        return this.httpClient.get<EntityPermission[]>('/api/entity-permissions/mine');
    }

    queryByEntity(entity: Entity): Observable<EntityPermission[]> {
        return this.httpClient.get<EntityPermission[]>(`/api/entity-permissions/entity/${entity._id}`);
    }

    create(entityPermission: EntityPermission): Observable<EntityPermission> {
        return this.httpClient.post<EntityPermission>(`/api/entity-permissions/`, entityPermission);
    }

    changeAccess(entityPermission: EntityPermission, newAccess: string): Observable<EntityPermission> {
        return this.httpClient.patch<EntityPermission>(`/api/entity-permissions/${entityPermission._id}`, [
            { op: 'replace', path: '/access', value: newAccess }
        ]);
    }

    delete(entityPermission: EntityPermission): Observable<EntityPermission> {
      return this.httpClient.delete(`/api/entity-permissions/${entityPermission._id}`)
          .pipe(
              map(() => entityPermission)
          );
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
