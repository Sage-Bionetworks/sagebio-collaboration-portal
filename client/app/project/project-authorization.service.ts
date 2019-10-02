import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, Subscription } from 'rxjs';
import { UserPermissionDataService } from 'components/auth/user-permission-data.service';
import { ProjectDataService } from './project-data.service';
import config from '../app.constants';

export interface ProjectAuthorization {
    canCreate: boolean;
    canRead: boolean;
    canEdit: boolean;
    canAdmin: boolean;
}

const DEFAULT_AUTHORIZATION: ProjectAuthorization = {
    canCreate: false,
    canRead: false,
    canEdit: false,
    canAdmin: false,
};

@Injectable()
export class ProjectAuthorizationService implements OnDestroy {
    private authorization_: BehaviorSubject<ProjectAuthorization> = new BehaviorSubject<ProjectAuthorization>(
        DEFAULT_AUTHORIZATION
    );
    private sub: Subscription;

    static parameters = [UserPermissionDataService, ProjectDataService];
    constructor(
        private userPermissionDataService: UserPermissionDataService,
        private projectDataService: ProjectDataService
    ) {
        const entityType = config.entityTypes.TOOL.value;
        this.sub = combineLatest(this.projectDataService.project(), this.userPermissionDataService.permissions()).subscribe(
            ([project, auth]) => {
                let projectAuth = DEFAULT_AUTHORIZATION;

                projectAuth.canCreate =
                    auth.isAdmin() || auth.hasActionPermission(config.actionPermissionTypes.CREATE_PROJECT.value);
                projectAuth.canRead = project && auth.canReadEntity(project._id, entityType);
                projectAuth.canEdit = project && auth.canWriteEntity(project._id, entityType);
                projectAuth.canAdmin = project && auth.canAdminEntity(project._id, entityType);

                this.authorization_.next(projectAuth);
            }
        );
    }

    ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

    authorization(): Observable<ProjectAuthorization> {
        return this.authorization_.asObservable();
    }
}
