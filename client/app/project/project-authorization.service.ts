import { Injectable } from '@angular/core';
import { UserPermissionDataService } from 'components/auth/user-permission-data.service';
import { EntityAuthorizationService } from 'components/authorization/entity-authorization.service';
import config from '../app.constants';

@Injectable()
export class ProjectAuthorizationService extends EntityAuthorizationService {
    // TODO Find a way to not have to inject the service in the child service, only the parent service.
    static parameters = [UserPermissionDataService];
    constructor(protected userPermissionDataService: UserPermissionDataService) {
        super(userPermissionDataService);
    }

    getEntityType(): string {
        return config.entityTypes.PROJECT.value;
    }

    getCreateActionPermissionType(): string {
        return config.actionPermissionTypes.CREATE_PROJECT.value;
    }
}
