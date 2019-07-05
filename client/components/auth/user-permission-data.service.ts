import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest, of, merge } from 'rxjs';
import { switchMap, map, filter, mapTo, catchError } from 'rxjs/operators';
import { UserPermission } from '../../../shared/interfaces/user-permission.model';
import { AuthService } from '../../components/auth/auth.service';
import { UserService } from '../../components/auth/user.service';
import { UserPermissionService } from './user-permission.service';
import { find } from 'lodash/fp';
import { UserRole } from '../../../shared/interfaces/user.model';

export class UserPermissions {

    constructor(private permissions: UserPermission[], private role: UserRole) { }

    public isAdmin(): boolean {
        return this.role === 'admin';  // TODO: why does UserRole.ADMIN throw an error?
    }

    public canCreateTool(): boolean {
        return this.isAdmin() || !!find({ 'value': 'createTool' }, this.permissions);
    }

    public canEditTool(): boolean {
        return this.isAdmin() || !!find({ 'value': 'editTool' }, this.permissions);
    }

    public canDeleteTool(): boolean {
        return this.isAdmin() || !!find({ 'value': 'deleteTool' }, this.permissions);
    }

    public hasRole(role: string): boolean {  // TODO input type must be UserRole
        return this.role === role;
    }

    public hasPermission(permission: string): boolean {  // TODO: use more specific input type
        return !!find({ 'value': permission }, this.permissions);
    }
}

@Injectable()
export class UserPermissionDataService {
    static UNKNOWN_PERMISSIONS = new UserPermissions([], undefined);
    private _permissions: BehaviorSubject<UserPermissions> =
        new BehaviorSubject<UserPermissions>(UserPermissionDataService.UNKNOWN_PERMISSIONS);

    static parameters = [AuthService, UserService, UserPermissionService];
    constructor(private authService: AuthService,
        private userService: UserService,
        private userPermissionService: UserPermissionService) {

        const isLoggedIn = this.authService.authInfo()
            .pipe(
                map(authInfo => authInfo.isLoggedIn())
            );

        const populatePermissions = isLoggedIn
            .pipe(
                filter(is => is),
                switchMap(() => this.userPermissionService.getMyPermissions()
                    .pipe(
                        catchError(err => of(<UserPermission[]>[]))
                    ))
            );

        const emptyPermissions = isLoggedIn
            .pipe(
                filter(is => is),
                mapTo([])
            );

        const populateRole = isLoggedIn
            .pipe(
                filter(is => is),
                switchMap(() => this.userService.get()
                    .pipe(
                        map(user => user.role),
                        catchError(err => of(<UserRole>undefined))
                    ))
            );

        const emptyRole = isLoggedIn
            .pipe(
                filter(is => is),
                mapTo(<UserRole>undefined)
            );

        const getPermissions = merge(
            populatePermissions,
            emptyPermissions
        );

        const getRole = merge(
            populateRole,
            emptyRole
        );

        combineLatest(getPermissions, getRole)
            .subscribe(([permissions, role]: any) => {
                this._permissions.next(new UserPermissions(permissions, role));
            });
    }

    /**
     * Returns the permissions of the user.
     * @return {Observable<UserPermissions>}
     */
    getPermissions(): Observable<UserPermissions> {
        return this._permissions.asObservable();
    }
}
