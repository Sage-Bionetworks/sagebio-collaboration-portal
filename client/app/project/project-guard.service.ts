import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, merge, forkJoin } from 'rxjs';
import { map, catchError, tap, filter, take } from 'rxjs/operators';
import { UserPermissionDataService } from 'components/auth/user-permission-data.service';
import { NotificationService } from 'components/notification/notification.service';
import { ProjectService } from './project.service';

@Injectable()
export class ProjectGuard implements CanActivate {
    static parameters = [Router, UserPermissionDataService, NotificationService, ProjectService];
    constructor(private router: Router,
        private userPermissionDataService: UserPermissionDataService,
        private notificationService: NotificationService,
        private projectService: ProjectService) { }

    canActivate(route: ActivatedRouteSnapshot):
        Observable<boolean> | boolean {

        const entityId = route.params.id;

        return forkJoin({
            permissions: this.userPermissionDataService.permissions()
                .pipe(
                    take(1)
                ),
            visibility: this.projectService.getVisibility(entityId)
        })
            .pipe(
                map(data => data.permissions.canReadEntity(entityId, 'project', data.visibility)),
                tap(canAccess => {
                    console.log('CAN ACCESS', canAccess);
                    if (!canAccess) {
                        this.notificationService.info('You do not have access to this project.');
                    }
                    return of(canAccess);
                }),
                catchError(err => {
                    console.error(err);
                    return of(false);
                })
            );
    }
}
