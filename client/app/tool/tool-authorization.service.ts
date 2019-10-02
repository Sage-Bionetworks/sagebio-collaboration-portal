import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, Subscription } from 'rxjs';
import { UserPermissionDataService } from 'components/auth/user-permission-data.service';
import { ToolDataService } from './tool-data.service';
import config from '../app.constants';

export interface ToolAuthorization {
    canCreate: boolean;
    canRead: boolean;
    canWrite: boolean;
    canAdmin: boolean;
}

const DEFAULT_AUTHORIZATION: ToolAuthorization = {
    canCreate: false,
    canRead: false,
    canWrite: false,
    canAdmin: false,
};

@Injectable()
export class ToolAuthorizationService implements OnDestroy {
    private authorization_: BehaviorSubject<ToolAuthorization> = new BehaviorSubject<ToolAuthorization>(
        DEFAULT_AUTHORIZATION
    );
    private sub: Subscription;

    static parameters = [UserPermissionDataService, ToolDataService];
    constructor(
        private userPermissionDataService: UserPermissionDataService,
        private toolDataService: ToolDataService
    ) {
        const entityType = config.entityTypes.TOOL.value;
        this.sub = combineLatest(this.toolDataService.tool(), this.userPermissionDataService.permissions()).subscribe(
            ([tool, auth]) => {
                let toolAuth = DEFAULT_AUTHORIZATION;

                toolAuth.canCreate =
                    auth.isAdmin() || auth.hasActionPermission(config.actionPermissionTypes.CREATE_TOOL.value);
                toolAuth.canRead = true;
                toolAuth.canWrite = tool && auth.canWriteEntity(tool._id, entityType);
                toolAuth.canAdmin = tool && auth.canAdminEntity(tool._id, entityType);

                this.authorization_.next(toolAuth);
            }
        );
    }

    ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

    authorization(): Observable<ToolAuthorization> {
        return this.authorization_.asObservable();
    }
}
