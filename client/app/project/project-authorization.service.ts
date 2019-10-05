import { Injectable } from '@angular/core';
import { Project } from 'models/entities/project.model';
import { UserPermissionDataService } from 'components/auth/user-permission-data.service';
import { EntityAuthorizationService } from 'components/authorization/entity-authorization.service';
import { ProjectService } from './project.service';
import config from '../app.constants';

@Injectable()
export class ProjectAuthorizationService extends EntityAuthorizationService<Project> {
    // TODO Find a way to not have to inject the service in the child service, only the parent service.
    static parameters = [UserPermissionDataService, ProjectService];
    constructor(
        protected userPermissionDataService: UserPermissionDataService,
        protected entityService: ProjectService
    ) {
        super(userPermissionDataService, entityService);
    }

    getEntityType(): string {
        return config.entityTypes.PROJECT.value;
    }

    getCreateActionPermissionType(): string {
        return config.actionPermissionTypes.CREATE_PROJECT.value;
    }
}
