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
        // const entityId = route.params.id;

        return this.toolAuthorizationService.authorization().pipe(
            map(auth => {
                switch (route.data.authorization) {
                    case ToolAuthorizationTypes.CREATE:
                        console.log('CHECKING FOR CREATE');
                        return auth.canCreate;
                    case ToolAuthorizationTypes.READ:
                        return auth.canRead;
                    case ToolAuthorizationTypes.ADMIN:
                        return auth.canAdmin;
                    default:
                        return false;
                }
            }),
            map(authorized => {
                console.log('Tool Guard', authorized);
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
