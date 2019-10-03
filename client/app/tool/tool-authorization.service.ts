import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, Subscription } from 'rxjs';
import { UserPermissionDataService } from 'components/auth/user-permission-data.service';
import { ToolDataService } from './tool-data.service';
import config from '../app.constants';
import { filter } from 'rxjs/operators';

export interface ToolAuthorization {
    canCreate: boolean;
    canRead: boolean;
    canEdit: boolean;
    canAdmin: boolean;
}

@Injectable()
export class ToolAuthorizationService implements OnDestroy {
    private authorization_: BehaviorSubject<ToolAuthorization> = new BehaviorSubject<ToolAuthorization>(null);
    private sub: Subscription;

    static parameters = [UserPermissionDataService, ToolDataService];
    constructor(
        private userPermissionDataService: UserPermissionDataService,
        private toolDataService: ToolDataService
    ) {
        const entityType = config.entityTypes.TOOL.value;
        this.sub = combineLatest(this.toolDataService.tool(), this.userPermissionDataService.permissions())
        .pipe(
            filter(([tool, auth]) => !!auth)
        )
        .subscribe(
            ([tool, auth]) => {
                let toolAuth = {
                    canCreate: false,
                    canRead: false,
                    canEdit: false,
                    canAdmin: false,
                };

                toolAuth.canCreate =
                    auth.isAdmin() || auth.hasActionPermission(config.actionPermissionTypes.CREATE_TOOL.value);
                toolAuth.canRead = true;
                toolAuth.canEdit = tool && auth.canWriteEntity(tool._id, entityType);
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
        return this.authorization_.asObservable().pipe(filter(auth => !!auth));
    }
}
