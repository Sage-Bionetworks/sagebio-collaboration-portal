import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, forkJoin, of, merge, Observable, Subscription, Subject, combineLatest } from 'rxjs';
import { switchMap, filter, tap, mapTo, last, pairwise, takeUntil, map, catchError, distinctUntilChanged } from 'rxjs/operators';
import { Tool } from 'models/entities/tool.model';
import { UserPermissionDataService } from 'components/auth/user-permission-data.service';
import { EntityPermission } from 'models/auth/entity-permission.model';
import { EntityPermissionService } from 'components/auth/entity-permission.service';
import { SocketService } from 'components/socket/socket.service';
import { UserEntityPermission } from 'components/auth/user-entity-permission.model';
import config from '../../app/app.constants';

export const DEFAULT_USER_PERMISSION: UserEntityPermission = {
    canRead: false,
    canWrite: false,
    canAdmin: false
};

interface ToolAclResult {
    tool: Tool;
    acl: EntityPermission[];
}

@Injectable()
export class ToolDataService implements OnDestroy {
    private _tool: BehaviorSubject<Tool> = new BehaviorSubject<Tool>(null);

    private _userPermission: BehaviorSubject<UserEntityPermission> = new BehaviorSubject<UserEntityPermission>(DEFAULT_USER_PERMISSION);
    private _acl: BehaviorSubject<EntityPermission[]> = new BehaviorSubject<EntityPermission[]>([]);
    private unsubscribe = new Subject<void>();

    private socketEventName: string;

    static parameters = [UserPermissionDataService, EntityPermissionService,
        SocketService];
    constructor(private userPermissionDataService: UserPermissionDataService,
        private entityPermissionService: EntityPermissionService,
        private socketService: SocketService) {

        this.getUserEntityPermission()
            .pipe(
                takeUntil(this.unsubscribe)
            )
            .subscribe(userPermission => {
                this._userPermission.next(userPermission);
            }, err => console.log(err), () => {
                this._userPermission.next(DEFAULT_USER_PERMISSION);
                this._userPermission.complete();
            });
    }

    ngOnDestroy() {
        this._tool.next(null);
        this.unsubscribe.next();
        this.unsubscribe.complete();
        if (this.socketEventName) {
            this.socketService.unsyncUpdates(this.socketEventName);
        }
    }

    public setTool(tool: Tool): void {
        console.log('PROJECT IS SET TO', tool);
        this._tool.next(tool);
        this.socketEventName = `tool:${tool._id}`;
        this.socketService.syncItemSubject(this.socketEventName, this._tool);
    }

    /**
     * Returns the ACL for this tool (if the user is authorized to).
     * @return {Observable<ToolAclResult>}
     */
    // private getACL(): Observable<ToolAclResult> {
    //
    //     const getToolAndUserPermission = combineLatest(
    //         this._tool
    //             .pipe(
    //                 pairwise()
    //             ),
    //         this._userPermission
    //     )
    //         .pipe(
    //             map(data => ({
    //                 prevTool: data[0][0],
    //                 tool: data[0][1],
    //                 canAdmin: data[1].canAdmin
    //             }))
    //         );
    //
    //     const queryACL = getToolAndUserPermission
    //         .pipe(
    //             filter(res => !!res.tool && res.canAdmin),
    //             switchMap(res => forkJoin({
    //                 tool: of(res.tool),
    //                 acl: this.entityPermissionService.queryByEntity(res.tool)
    //             }))
    //         );
    //
    //     const emptyACL = getToolAndUserPermission
    //         .pipe(
    //             filter(res => !res.tool || !res.canAdmin),
    //             distinctUntilChanged((prev, curr) => {
    //                 return (!prev.tool || !prev.canAdmin) !== (!curr.tool || !curr.canAdmin);
    //             }),
    //             tap(res => {
    //                 if (res.prevTool) {
    //                     this.socketService.unsyncUpdates(`tool:${res.prevTool}:entityPermission`);
    //                 }
    //             }),
    //             mapTo({
    //                 tool: <Tool>null,
    //                 acl: <EntityPermission[]>[]
    //             })
    //         );
    //
    //     const getACL = merge(
    //         queryACL,
    //         emptyACL
    //     );
    //
    //     return getACL;
    // }

    /**
     * Returns the permission of the current user for this tool.
     * @return {Observable<UserEntityPermission>}
     */
    private getUserEntityPermission(): Observable<UserEntityPermission> {
        const queryUserEntityPermission = this._tool
            .pipe(
                filter(tool => !!tool),
                switchMap(tool => this.userPermissionDataService.permissions()
                    .pipe(
                        map(permissions => ({
                            canRead: permissions.canReadEntity(
                                tool._id,
                                config.entityTypes.TOOL.value
                            ),
                            canWrite: permissions.canWriteEntity(
                                tool._id,
                                config.entityTypes.TOOL.value
                            ),
                            canAdmin: permissions.canAdminEntity(
                                tool._id,
                                config.entityTypes.TOOL.value
                            )
                        })),
                        catchError(err => of(<UserEntityPermission>DEFAULT_USER_PERMISSION))
                    )
                )
            );

        const emptyUserEntityPermission = this._tool
            .pipe(
                filter(tool => !tool),
                mapTo(DEFAULT_USER_PERMISSION)
            );

        const getUserEntityPermission = merge(
            queryUserEntityPermission,
            emptyUserEntityPermission
        );

        return getUserEntityPermission;
    }

    tool(): Observable<Tool> {
        return this._tool.asObservable();
    }

    /**
     * Returns whether the user can admin the tool.
     * @return {Observable<UserEntityPermission>}
     */
    userPermission(): Observable<UserEntityPermission> {
        return this._userPermission.asObservable();
    }

    /**
     * Returns the ACL associated to this tool.
     * @return {Observable<boolean>}
     */
    // acl(): Observable<EntityPermission[]> {
    //     return this._acl.asObservable();
    // }
}
