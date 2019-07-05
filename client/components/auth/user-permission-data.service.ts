import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest, of, merge, forkJoin } from 'rxjs';
import { switchMap, map, filter, mapTo, catchError, tap } from 'rxjs/operators';
import { UserPermission } from '../../../shared/interfaces/user-permission.model';
import { AuthService } from '../../components/auth/auth.service';
import { UserService } from '../../components/auth/user.service';
import { UserPermissionService } from './user-permission.service';
import { find } from 'lodash/fp';
import { UserRole } from '../../../shared/interfaces/user.model';

export class UserPermissions {

    constructor(private permissions: UserPermission[], private role: UserRole) { }

    public isAdmin(): boolean {
        return this.role === UserRole.ADMIN;
    }

    public hasRole(role: UserRole | string): boolean {
        return this.role === role;
    }

    public hasPermission(permission: string): boolean {
        return !!find({ 'value': permission }, this.permissions);
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
                switchMap(() => forkJoin({
                    permissions: this.userPermissionService.getMyPermissions()
                        .pipe(
                            catchError(err => of(<UserPermission[]>[]))
                        ),
                    role: this.userService.get()
                        .pipe(
                            map(user => user.role),
                            catchError(err => of(<UserRole>undefined))
                        )
                }))
            );

        const emptyPermissions = isLoggedIn
            .pipe(
                filter(is => !is),
                mapTo({
                    role: <UserRole>undefined,
                    permissions: <UserPermission[]>[]
                })
            );

        const getPermissions = merge(
            populatePermissions,
            emptyPermissions
        );

        getPermissions
            .subscribe(res => {
                console.log('role and permission', res);
                this._permissions.next(new UserPermissions(res.permissions, res.role));
            }, err => {
                console.log(err);
            }, () => {
                console.log('getPermissions has completed');
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
