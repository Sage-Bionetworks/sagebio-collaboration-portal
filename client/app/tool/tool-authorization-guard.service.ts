import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { ToolAuthorizationService } from './tool-authorization.service';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
// import { Observable, of, merge, forkJoin } from 'rxjs';
// import { map, catchError, tap, filter, take } from 'rxjs/operators';
// import { UserPermissionDataService } from 'components/auth/user-permission-data.service';
// import { NotificationService } from 'components/notification/notification.service';
// import { ProjectService } from './project.service';

export enum ToolAuthorizationTypes {
    CREATE,
    READ,
    WRITE,
    ADMIN,
}

@Injectable()
export class ToolAuthorizationGuard implements CanActivate {
    static parameters = [Router, ToolAuthorizationService];
    constructor(private router: Router, private toolAuthorizationService: ToolAuthorizationService) {}

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
        const entityId = route.params.id;

        return this.toolAuthorizationService.authorization().pipe(
            map(auth => {
                if (route.data.authorization === ToolAuthorizationTypes.CREATE) {
                    return auth.canCreate;
                }
                return false;
            }),
            map(authorized => {
                this.router.navigate(['/', 'tools']);
                return authorized;
            }),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );

        // return forkJoin({
        //     permissions: this.userPermissionDataService.permissions().pipe(take(1)),
        //     visibility: this.projectService.getVisibility(entityId),
        // }).pipe(
        //     map(data => data.permissions.canReadEntity(entityId, 'project', data.visibility)),
        //     tap(canAccess => {
        //         console.log('CAN ACCESS', canAccess);
        //         if (!canAccess) {
        //             this.notificationService.info('You do not have access to this project.');
        //         }
        //         return of(canAccess);
        //     }),
        //     catchError(err => {
        //         console.error(err);
        //         return of(false);
        //     })
        // );
    }
}
