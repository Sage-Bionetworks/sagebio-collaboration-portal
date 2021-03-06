import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subscription, of } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { UserPermissionDataService } from 'components/auth/user-permission-data.service';
import { EntityService } from 'components/entity/entity.service';
import { Entity } from 'models/entities/entity.model';

export interface EntityAuthorization {
    canCreate: boolean;
    canRead: boolean;
    canEdit: boolean;
    canAdmin: boolean;
}

@Injectable()
export abstract class EntityAuthorizationService<E extends Entity> {
    constructor(protected userPermissionDataService: UserPermissionDataService, protected entityService: EntityService<E>) {}

    abstract getEntityType(): string; // TODO use enum

    // TODO Put in place a convention that remove the need to implement this.
    abstract getCreateActionPermissionType(): string; // TODO use enum

    /**
     * Returns true if the user can create an entity of a given type.
     */
    canCreate(): Observable<boolean> {
        return this.userPermissionDataService.permissions().pipe(
            filter(auth => !!auth),
            map(auth => {
                const isAdmin = auth.isAdmin();
                const hasActionPermission = auth.hasActionPermission(this.getCreateActionPermissionType());
                return isAdmin || hasActionPermission;
            })
        );
    }

    /**
     * Returns true if the user can read the entity specified.
     * @param entityId
     */
    canRead(entityId: string): Observable<boolean> {
        return this.entityService.isPublic(entityId).pipe(
            switchMap(isPublic =>
                isPublic
                    ? of(true)
                    : this.userPermissionDataService.permissions().pipe(
                          filter(auth => !!auth),
                          map(auth => auth.canReadEntity(entityId, this.getEntityType()))
                      )
            )
        );
    }

    /**
     * Returns true if the user can write to the entity specified.
     * @param entityId
     */
    canWrite(entityId: string): Observable<boolean> {
        return this.userPermissionDataService.permissions().pipe(
            filter(auth => !!auth),
            map(auth => auth.canWriteEntity(entityId, this.getEntityType()))
        );
    }

    /**
     * Returns true if the user can admin the entity specified.
     * @param entityId
     */
    canAdmin(entityId: string): Observable<boolean> {
        return this.userPermissionDataService.permissions().pipe(
            filter(auth => !!auth),
            map(auth => auth.canAdminEntity(entityId, this.getEntityType()))
        );
    }
}
