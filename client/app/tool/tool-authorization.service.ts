import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, mapTo } from 'rxjs/operators';
import { UserPermissionDataService } from 'components/auth/user-permission-data.service';
import { EntityAuthorizationService } from 'components/authorization/entity-authorization.service';
import config from '../app.constants';

@Injectable()
export class ToolAuthorizationService extends EntityAuthorizationService {
    // TODO Find a way to not have to inject the service in the child service, only the parent service.
    static parameters = [UserPermissionDataService];
    constructor(protected userPermissionDataService: UserPermissionDataService) {
        super(userPermissionDataService);
    }

    getEntityType(): string {
        return config.entityTypes.TOOL.value;
    }

    getCreateActionPermissionType(): string {
        return config.actionPermissionTypes.CREATE_TOOL.value;
    }

    /** @override */
    canRead(toolId: string): Observable<boolean> {
        return this.userPermissionDataService.permissions().pipe(
            filter(auth => !!auth),
            mapTo(true)
        );
    }
}
