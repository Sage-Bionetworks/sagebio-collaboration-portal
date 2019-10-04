import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ToolAuthorizationService } from './tool-authorization.service';

export enum ToolAuthorizationTypes {
    CREATE,
    READ,
    ADMIN,
}

@Injectable()
export class ToolGuard implements CanActivate {
    static parameters = [Router, ToolAuthorizationService];
    constructor(private router: Router, private toolAuthorizationService: ToolAuthorizationService) {}

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
        let authorized$: Observable<boolean>;

        switch (route.data.authorization) {
            case ToolAuthorizationTypes.CREATE:
                authorized$ = this.toolAuthorizationService.canCreate();
                break;
            case ToolAuthorizationTypes.READ:
                authorized$ = this.toolAuthorizationService.canRead(route.params.id);
                break;
            case ToolAuthorizationTypes.ADMIN:
                authorized$ = this.toolAuthorizationService.canAdmin(route.params.id);
                break;
            default:
                authorized$ = of(false);
        }

        return authorized$.pipe(
            map(authorized => {
                if (!authorized) {
                    this.router.navigate(['/', 'tools']);
                }
                return authorized;
            }),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }
}
