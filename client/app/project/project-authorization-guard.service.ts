import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ProjectAuthorizationService } from './project-authorization.service';

export enum ProjectAuthorizationTypes {
    CREATE,
    READ,
    ADMIN,
}

@Injectable()
export class ProjectAuthorizationGuard implements CanActivate {
    static parameters = [Router, ProjectAuthorizationService];
    constructor(private router: Router, private projectAuthorizationService: ProjectAuthorizationService) {}

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
        // const entityId = route.params.id;

        return this.projectAuthorizationService.authorization().pipe(
            map(auth => {
                switch (route.data.authorization) {
                    case ProjectAuthorizationTypes.CREATE:
                        return auth.canCreate;
                    case ProjectAuthorizationTypes.READ:
                        return auth.canRead;
                    case ProjectAuthorizationTypes.ADMIN:
                        return auth.canAdmin;
                    default:
                        return false;
                }
            }),
            map(authorized => {
                if (!authorized) {
                    this.router.navigate(['/', 'projects']);
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
