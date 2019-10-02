import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserPermissionDataService } from 'components/auth/user-permission-data.service';
import { UserEntityPermission } from 'components/auth/user-entity-permission.model';

export const DEFAULT_USER_PERMISSION: UserEntityPermission = {
    canRead: false,
    canWrite: false,
    canAdmin: false,
};

@Injectable()
export class ToolAuthorizationService implements OnInit {
    private authorization_: BehaviorSubject<UserEntityPermission> = new BehaviorSubject<UserEntityPermission>(
        DEFAULT_USER_PERMISSION
    );

    static parameters = [UserPermissionDataService];
    constructor(private userPermissionDataService: UserPermissionDataService) {}

    ngOnInit() {}

    authorization(): Observable<UserEntityPermission> {
        return this.authorization_.asObservable();
    }
}
