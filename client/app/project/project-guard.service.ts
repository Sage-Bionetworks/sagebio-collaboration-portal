import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError, tap, filter } from 'rxjs/operators';
import { UserPermissionDataService } from 'components/auth/user-permission-data.service';
import { NotificationService } from 'components/notification/notification.service';

@Injectable()
export class ProjectGuard implements CanActivate {
    static parameters = [Router, UserPermissionDataService, NotificationService];
    constructor(private router: Router,
        private userPermissionDataService: UserPermissionDataService,
        private notificationService: NotificationService) { }

    canActivate(route: ActivatedRouteSnapshot):
        Observable<boolean> | boolean {

        const entityId = route.params.id;
        return this.userPermissionDataService.permissions()
            .pipe(
                map(permissions => permissions.canReadEntity(entityId, 'project')),
                filter(canReadEntity => canReadEntity),
                tap(canAccess => {
                    if (!canAccess) {
                        this.notificationService.info('You do not have access to this project.');
                        this.router.navigate(['']);
                    }
                }),
                catchError(err => {
                    console.log(err);
                    return of(false);
                })
            );
    }
}
