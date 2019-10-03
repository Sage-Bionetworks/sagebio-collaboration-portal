import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { UserPermissionDataService } from 'components/auth/user-permission-data.service';
import { ProjectDataService } from './project-data.service';
import config from '../app.constants';

export interface ProjectAuthorization {
    canCreate: boolean;
    canRead: boolean;
    canEdit: boolean;
    canAdmin: boolean;
}

@Injectable()
export class ProjectAuthorizationService implements OnDestroy {
    private authorization_: BehaviorSubject<ProjectAuthorization> = new BehaviorSubject<ProjectAuthorization>(null);
    private authorizationSub: Subscription;

    static parameters = [UserPermissionDataService, ProjectDataService];
    constructor(
        private userPermissionDataService: UserPermissionDataService,
        private projectDataService: ProjectDataService
    ) {
        const entityType = config.entityTypes.PROJECT.value;
        this.authorizationSub = combineLatest(
            this.projectDataService.project(),
            this.userPermissionDataService.permissions()
        )
            .pipe(filter(([tool, auth]) => !!auth))
            .subscribe(([project, auth]) => {
                let projectAuth = {
                    canCreate: false,
                    canRead: false,
                    canEdit: false,
                    canAdmin: false,
                };

                projectAuth.canCreate =
                    auth.isAdmin() || auth.hasActionPermission(config.actionPermissionTypes.CREATE_PROJECT.value);
                projectAuth.canRead = project && auth.canReadEntity(project._id, entityType);
                projectAuth.canEdit = project && auth.canWriteEntity(project._id, entityType);
                projectAuth.canAdmin = project && auth.canAdminEntity(project._id, entityType);

                console.log('PROJECT AUTH', projectAuth);

                this.authorization_.next(projectAuth);
            });
    }

    ngOnDestroy() {
        if (this.authorizationSub) {
            this.authorizationSub.unsubscribe();
        }
    }

    authorization(): Observable<ProjectAuthorization> {
        return this.authorization_.asObservable().pipe(filter(auth => !!auth));
    }
}
