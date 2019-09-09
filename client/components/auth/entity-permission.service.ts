import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Entity } from 'models/entities/entity.model';
import { EntityPermission } from 'models/auth/entity-permission.model';

@Injectable()
export class EntityPermissionService {
    static parameters = [HttpClient];
    constructor(private httpClient: HttpClient) {}

    /**
     * Returns the entity-permissions of the current user.
     */
    query(): Observable<EntityPermission[]> {
        return this.httpClient.get<EntityPermission[]>('/api/entity-permissions');
    }

    /**
     * Returns the entity-permissions of the entity specified.
     * @param entity
     */
    queryByEntity(entity: Entity): Observable<EntityPermission[]> {
        return this.httpClient.get<EntityPermission[]>(`/api/entity-permissions/entity/${entity._id}`);
    }

    /**
     * Create a new entity-permission.
     * @param entityPermission
     */
    create(entityPermission: EntityPermission): Observable<EntityPermission> {
        return this.httpClient.post<EntityPermission>('/api/entity-permissions', entityPermission);
    }

    /**
     * Changes the access of an entity-permission.
     * @param entityPermission
     * @param newAccess
     */
    changeAccess(entityPermission: EntityPermission, newAccess: string): Observable<EntityPermission> {
        return this.httpClient.patch<EntityPermission>(`/api/entity-permissions/${entityPermission._id}`, [
            { op: 'replace', path: '/access', value: newAccess },
        ]);
    }

    /**
     * Changes the status of an entity-permission.
     * @param entityPermission
     * @param newAccess
     */
    changeStatus(entityPermission: EntityPermission, newStatus: string): Observable<EntityPermission> {
        return this.httpClient.patch<EntityPermission>(`/api/entity-permissions/${entityPermission._id}`, [
            { op: 'replace', path: '/status', value: newStatus },
        ]);
    }

    /**
     * Deletes an entity-permission.
     * @param entityPermission
     */
    delete(entityPermission: EntityPermission): Observable<EntityPermission> {
        return this.httpClient
            .delete(`/api/entity-permissions/${entityPermission._id}`)
            .pipe(map(() => entityPermission));
    }
}
