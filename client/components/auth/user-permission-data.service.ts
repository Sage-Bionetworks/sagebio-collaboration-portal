import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest, of, merge, forkJoin } from 'rxjs';
import { switchMap, map, filter, mapTo, catchError, tap } from 'rxjs/operators';
import { UserPermission } from 'models/auth/user-permission.model';
import { EntityPermission } from 'models/auth/entity-permission.model';
import { AuthService } from 'components/auth/auth.service';
import { UserService } from 'components/auth/user.service';
import { UserPermissionService } from './user-permission.service';
import { EntityPermissionService } from './entity-permission.service';
import { find, identity } from 'lodash/fp';
import { UserRole } from 'models/auth/user.model';
import { Project } from 'models/project.model';
import { SocketService } from 'components/socket/socket.service';
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

    private getEntityUserAccess(entityId: string, entityType: string): string {
        let permission = find({
            entityId: entityId,
            entityType: entityType
        }, this.entityPermissions);
        return permission ? permission.access : null;
    }

    public canReadEntity(entityId: string, entityType: string): boolean {
        const access = this.getEntityUserAccess(entityId, entityType);
        return this.isAdmin() || identity([
            config.accessTypes.READ.value,
            config.accessTypes.WRITE.value,
            config.accessTypes.ADMIN.value
        ]).includes(access);
    }

    public canWriteEntity(entityId: string, entityType: string): boolean {
        const access = this.getEntityUserAccess(entityId, entityType);
        return this.isAdmin() || identity([
            config.accessTypes.WRITE.value,
            config.accessTypes.ADMIN.value
        ]).includes(access);
    }

    public canAdminEntity(entityId: string, entityType: string): boolean {
        const access = this.getEntityUserAccess(entityId, entityType);
        return this.isAdmin() || identity([
            config.accessTypes.ADMIN.value
        ]).includes(access);
    }

    public countPendingEntityInvites(): number {
        return this.getPendingEntityInvites().length;
    }

    public getPendingEntityInvites(): EntityPermission[] {
        if (this.entityPermissions) {
            return this.entityPermissions.filter(invite => {
                return invite.status === config.inviteStatusTypes.PENDING.value;
            });
        }
        return [];
    }
}

@Injectable()
export class UserPermissionDataService {
    static UNKNOWN_PERMISSIONS = new UserPermissions(null, [], []);

    private _permissions: BehaviorSubject<UserPermissions> =
        new BehaviorSubject<UserPermissions>(UserPermissionDataService.UNKNOWN_PERMISSIONS);

    static parameters = [AuthService, UserService, UserPermissionService,
        EntityPermissionService, SocketService];
    constructor(private authService: AuthService,
        private userService: UserService,
        private userPermissionService: UserPermissionService,
        private entityPermissionService: EntityPermissionService,
        private socketService: SocketService) {

        console.log('NEW USER PERMISSION DATA SERVICE');

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
                            catchError(err => of(<UserRole>null))
                        ),
                    permissions: this.userPermissionService.getMyPermissions()
                        .pipe(
                            catchError(err => of(<UserPermission[]>[]))
                        ),
                    entityPermissions: this.entityPermissionService.queryMine()
                        .pipe(
                            catchError(err => of(<EntityPermission[]>[]))
                        )
                }))
            );

        const emptyPermissions = isLoggedIn
            .pipe(
                filter(is => !is),
                mapTo({
                    role: <UserRole>null,
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
                let role = res.role;
                let permissions = res.permissions;
                let entityPermissions = res.entityPermissions;

                this._permissions.next(new UserPermissions(
                    role,
                    permissions,
                    entityPermissions
                ));

                // update the role of the user
                if (role) {
                    this.socketService.syncUpdates(`user`,
                        [], (event, item, array) => {
                            role = item.role;
                            this._permissions.next(new UserPermissions(
                                role,
                                permissions,
                                entityPermissions
                            ));
                        });
                } else {
                    // TODO Unsync
                    // this.socketService.unsyncUpdates(`user`);
                }

                // update user-based permissions with WebSocket
                if (permissions) {
                    this.socketService.syncUpdates(`userPermission`,
                        permissions, (event, item, array) => {
                            this._permissions.next(new UserPermissions(
                                role,
                                permissions,
                                entityPermissions
                            ));
                        });
                } else {
                    this.socketService.unsyncUpdates(`userPermission`);
                }

                // update entity-based permissions with WebSocket
                if (entityPermissions) {
                    this.socketService.syncUpdates(`entityPermission`,
                        entityPermissions, (event, item, array) => {
                            this._permissions.next(new UserPermissions(
                                role,
                                permissions,
                                entityPermissions
                            ));
                        });
                } else {
                    this.socketService.unsyncUpdates(`entityPermission`);
                }
            }, err => {
                console.log(err);
            });
    }

    /**
     * Returns the permissions of the user.
     * @return {Observable<UserPermissions>}
     */
    permissions(): Observable<UserPermissions> {
        return this._permissions.asObservable();
    }

    acceptEntityPermission(invite: EntityPermission): Observable<EntityPermission> {
        return this.entityPermissionService
            .changeStatus(invite, config.inviteStatusTypes.ACCEPTED.value);
    }

    declineEntityPermission(invite: EntityPermission): Observable<EntityPermission> {
        return this.entityPermissionService
            .changeStatus(invite, config.inviteStatusTypes.DECLINED.value);
    }
}
