import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface EntityAuthorization {
    canCreate: boolean;
    canRead: boolean;
    canEdit: boolean;
    canAdmin: boolean;
}

@Injectable()
export abstract class EntityAuthorizationService {
    /**
     * Returns true if the user can create an entity of a given type.
     */
    abstract canCreate(): Observable<boolean>;

    /**
     * Returns true if the user can read the entity specified.
     * @param entityId
     */
    abstract canRead(entityId: string): Observable<boolean>;

    /**
     * Returns true if the user can edit the entity specified.
     * @param entityId
     */
    abstract canEdit(entityId: string): Observable<boolean>;

    /**
     * Returns true if the user can admin the entity specified.
     * @param entityId
     */
    abstract canAdmin(entityId: string): Observable<boolean>;
}
