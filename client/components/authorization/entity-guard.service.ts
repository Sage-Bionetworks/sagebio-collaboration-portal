import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { EntityAuthorizationService } from './entity-authorization.service';

export enum EntityAuthorizationTypes {
    CREATE,
    READ,
    WRITE,
    ADMIN,
}

@Injectable()
export abstract class EntityGuard implements CanActivate {
    constructor(protected router: Router, protected authorizationService: EntityAuthorizationService) {}

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
        let authorized$: Observable<boolean>;

        switch (route.data.authorization) {
            case EntityAuthorizationTypes.CREATE:
                authorized$ = this.authorizationService.canCreate();
                break;
            case EntityAuthorizationTypes.READ:
                authorized$ = this.authorizationService.canRead(route.params.id || route.parent.params.id);
                break;
            case EntityAuthorizationTypes.WRITE:
                authorized$ = this.authorizationService.canWrite(route.params.id || route.parent.params.id);
                break;
            case EntityAuthorizationTypes.ADMIN:
                authorized$ = this.authorizationService.canAdmin(route.params.id || route.parent.params.id);
                break;
            default:
                authorized$ = of(false);
        }

        return authorized$.pipe(
            map(authorized => {
                if (!authorized) {
                    this.router.navigate(this.falsyRedirectUrl());
                }
                return authorized;
            }),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }

    abstract falsyRedirectUrl(): string[];
}
