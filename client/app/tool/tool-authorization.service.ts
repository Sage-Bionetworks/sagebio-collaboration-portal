import { Injectable } from '@angular/core';
import { Tool } from 'models/entities/tool.model';
import { UserPermissionDataService } from 'components/auth/user-permission-data.service';
import { EntityAuthorizationService } from 'components/authorization/entity-authorization.service';
import { ToolService } from './tool.service';
import config from '../app.constants';

@Injectable()
export class ToolAuthorizationService extends EntityAuthorizationService<Tool> {
    // TODO Find a way to not have to inject the service in the child service, only the parent service.
    static parameters = [UserPermissionDataService, ToolService];
    constructor(protected userPermissionDataService: UserPermissionDataService, protected entityService: ToolService) {
        super(userPermissionDataService, entityService);
    }

    getEntityType(): string {
        return config.entityTypes.TOOL.value;
    }

    getCreateActionPermissionType(): string {
        return config.actionPermissionTypes.CREATE_TOOL.value;
    }
}
