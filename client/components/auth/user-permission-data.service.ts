import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest, of, merge, forkJoin } from 'rxjs';
import { switchMap, map, filter, mapTo, catchError, tap } from 'rxjs/operators';
import { UserPermission } from 'models/auth/user-permission.model';
import { EntityPermission } from 'models/auth/entity-permission.model';
import { AuthService } from 'components/auth/auth.service';
import { UserService } from 'components/auth/user.service';
import { UserPermissionService } from './user-permission.service';
import { EntityPermissionService } from './entity-permission.service';
import { find } from 'lodash/fp';
import { UserRole } from 'models/auth/user.model';
import { Project } from 'models/project.model';
import config from '../../app/app.constants';

export class UserPermissions {

    constructor(private role: UserRole, private permissions: UserPermission[],
        private entityPermissions: EntityPermission[]) { }

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

    public canAdminEntity(entityId: string, entityType: string): boolean {
        return this.isAdmin() || !!find({
            entityId: entityId,
            entityType: entityType,
            access: config.accessTypes.ADMIN
        });
    }

    public canAdminProject(project: Project): boolean {
        return this.canAdminEntity(
            project._id,
            config.entityTypes.PROJECT.value
        );
    }
}

@Injectable()
export class UserPermissionDataService {
    static UNKNOWN_PERMISSIONS = new UserPermissions(undefined, [], []);

    private _permissions: BehaviorSubject<UserPermissions> =
        new BehaviorSubject<UserPermissions>(UserPermissionDataService.UNKNOWN_PERMISSIONS);

    static parameters = [AuthService, UserService, UserPermissionService,
        EntityPermissionService];
    constructor(private authService: AuthService,
        private userService: UserService,
        private userPermissionService: UserPermissionService,
        private entityPermissionService: EntityPermissionService) {

        const isLoggedIn = this.authService.authInfo()
            .pipe(
                map(authInfo => authInfo.isLoggedIn())
            );

        const populatePermissions = isLoggedIn
            .pipe(
                filter(is => is),
                switchMap(() => forkJoin({
                    role: this.userService.get()
                        .pipe(
                            map(user => user.role),
                            catchError(err => of(<UserRole>undefined))
                        ),
                    permissions: this.userPermissionService.getMyPermissions()
                        .pipe(
                            catchError(err => of(<UserPermission[]>[]))
                        ),
                    entityPermissions: this.entityPermissionService.getMyPermissions()
                        .pipe(
                            catchError(err => of(<EntityPermission[]>[]))
                        )
                }))
            );

        const emptyPermissions = isLoggedIn
            .pipe(
                filter(is => !is),
                mapTo({
                    role: <UserRole>undefined,
                    permissions: <UserPermission[]>[],
                    entityPermissions: <EntityPermission[]>[]
                })
            );

        const getPermissions = merge(
            populatePermissions,
            emptyPermissions
        );

        getPermissions
            .subscribe(res => {
                this._permissions.next(new UserPermissions(
                    res.role,
                    res.permissions,
                    res.entityPermissions
                ));
            }, err => {
                console.log(err);
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
