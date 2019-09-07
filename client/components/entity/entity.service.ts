import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Entity } from 'models/entities/entity.model';
import { Patch } from 'models/patch.model';
import { QueryListResponse } from 'models/query-list-response.model';

@Injectable()
export abstract class EntityService<E extends Entity> {
    /**
     * Returns the entity visible to the user.
     * @param query
     */
    abstract query(query?: {}): Observable<QueryListResponse<E>>;

    /**
     * Returns the entity with the id specified.
     * @param id
     */
    abstract get(id: string): Observable<E>;

    /**
     * Returns the entity with the slug specified.
     * @param slug
     */
    abstract getBySlug(slug: string): Observable<E>;

    /**
     * Creates a new entity.
     * @param id
     */
    abstract create(entity: E): Observable<E>;

    /**
     *
     * @param id Updates the entity with the id specified.
     * @param patches
     */
    abstract update(id: string, patches: Patch[]): Observable<E>;

    /**
     * Makes an entity public.
     * @param entity
     */
    abstract makePublic(entity: E): Observable<E>;

    /**
     * Makes an entity private.
     * @param entity
     */
    abstract makePrivate(entity: E): Observable<E>;
}
