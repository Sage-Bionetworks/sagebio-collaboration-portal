import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, mapTo } from 'rxjs/operators';
import { UserPermissionDataService } from 'components/auth/user-permission-data.service';
import { EntityAuthorizationService } from 'components/authorization/entity-authorization.service';
import config from '../app.constants';

@Injectable()
export class ToolAuthorizationService implements EntityAuthorizationService {
    private entityType: string;

    static parameters = [UserPermissionDataService];
    constructor(private userPermissionDataService: UserPermissionDataService) {
        this.entityType = config.entityTypes.TOOL.value;
    }

    canCreate(): Observable<boolean> {
        return this.userPermissionDataService.permissions().pipe(
            filter(auth => !!auth),
            map(auth => {
                const isAdmin = auth.isAdmin();
                const hasActionPermission = auth.hasActionPermission(config.actionPermissionTypes.CREATE_TOOL.value);
                return isAdmin || hasActionPermission;
            })
        );
    }

    canRead(toolId: string): Observable<boolean> {
        return this.userPermissionDataService.permissions().pipe(
            filter(auth => !!auth),
            mapTo(true)
        );
    }

    canEdit(toolId: string): Observable<boolean> {
        return this.userPermissionDataService.permissions().pipe(
            filter(auth => !!auth),
            map(auth => auth.canWriteEntity(toolId, this.entityType))
        );
    }

    canAdmin(toolId: string): Observable<boolean> {
        return this.userPermissionDataService.permissions().pipe(
            filter(auth => !!auth),
            map(auth => auth.canAdminEntity(toolId, this.entityType))
        );
    }
}
