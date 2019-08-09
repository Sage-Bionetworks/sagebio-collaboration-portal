import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, forkJoin, of, merge, Observable, Subscription, Subject, combineLatest } from 'rxjs';
import { switchMap, filter, tap, mapTo, last, pairwise, takeUntil, map, catchError, distinctUntilChanged } from 'rxjs/operators';
import { Project } from 'models/project.model';
import { UserPermissionDataService } from 'components/auth/user-permission-data.service';
import { EntityPermission } from 'models/auth/entity-permission.model';
import { EntityPermissionService } from 'components/auth/entity-permission.service';
import { SocketService } from 'components/socket/socket.service';
import { UserProjectPermission } from './models/user-project-permission.model';
import config from '../../app/app.constants';

export const DEFAULT_USER_PERMISSION: UserProjectPermission = {
    canRead: false,
    canWrite: false,
    canAdmin: false
};

interface ProjectAclResult {
    project: Project;
    acl: EntityPermission[];
}

@Injectable()
export class ProjectDataService implements OnDestroy {
    private _project: BehaviorSubject<Project> = new BehaviorSubject<Project>(null);

    private _userPermission: BehaviorSubject<UserProjectPermission> = new BehaviorSubject<UserProjectPermission>(DEFAULT_USER_PERMISSION);
    private _acl: BehaviorSubject<EntityPermission[]> = new BehaviorSubject<EntityPermission[]>([]);
    private unsubscribe = new Subject<void>();

    static parameters = [UserPermissionDataService, EntityPermissionService,
        SocketService];
    constructor(private userPermissionDataService: UserPermissionDataService,
        private entityPermissionService: EntityPermissionService,
        private socketService: SocketService) {

        this.getUserProjectPermission()
            .pipe(
                takeUntil(this.unsubscribe)
            )
            .subscribe(userPermission => {
                this._userPermission.next(userPermission);
            }, err => console.log(err), () => {
                this._userPermission.next(DEFAULT_USER_PERMISSION);
                this._userPermission.complete();
            });

        // this.getACL()
        //     .pipe(
        //         takeUntil(this.unsubscribe)
        //     )
        //     .subscribe((res: ProjectAclResult) => {
        //         console.log('ACL are now', res);
        //         this._acl.next(res.acl);
        //         if (res.project) {
        //             this.socketService.syncArraySubject(`project:${res.project._id}:entityPermission`, this._acl);
        //         }
        //     }, err => console.log(err), () => {
        //         this._acl.next([]);
        //         this._acl.complete();
        //     });
    }

    ngOnDestroy() {
        this._project.next(null);
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    public setProject(project: Project): void {
        this._project.next(project);
    }

    /**
     * Returns the ACL for this project (if the user is authorized to).
     * @return {Observable<ProjectAclResult>}
     */
    // private getACL(): Observable<ProjectAclResult> {
    //
    //     const getProjectAndUserPermission = combineLatest(
    //         this._project
    //             .pipe(
    //                 pairwise()
    //             ),
    //         this._userPermission
    //     )
    //         .pipe(
    //             map(data => ({
    //                 prevProject: data[0][0],
    //                 project: data[0][1],
    //                 canAdmin: data[1].canAdmin
    //             }))
    //         );
    //
    //     const queryACL = getProjectAndUserPermission
    //         .pipe(
    //             filter(res => !!res.project && res.canAdmin),
    //             switchMap(res => forkJoin({
    //                 project: of(res.project),
    //                 acl: this.entityPermissionService.queryByEntity(res.project)
    //             }))
    //         );
    //
    //     const emptyACL = getProjectAndUserPermission
    //         .pipe(
    //             filter(res => !res.project || !res.canAdmin),
    //             distinctUntilChanged((prev, curr) => {
    //                 return (!prev.project || !prev.canAdmin) !== (!curr.project || !curr.canAdmin);
    //             }),
    //             tap(res => {
    //                 if (res.prevProject) {
    //                     this.socketService.unsyncUpdates(`project:${res.prevProject}:entityPermission`);
    //                 }
    //             }),
    //             mapTo({
    //                 project: <Project>null,
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
     * Returns the permission of the current user for this project.
     * @return {Observable<UserProjectPermission>}
     */
    private getUserProjectPermission(): Observable<UserProjectPermission> {
        const queryUserProjectPermission = this._project
            .pipe(
                filter(project => !!project),
                switchMap(project => this.userPermissionDataService.permissions()
                    .pipe(
                        map(permissions => ({
                            canRead: permissions.canReadEntity(
                                project._id,
                                config.entityTypes.PROJECT.value
                            ),
                            canWrite: permissions.canWriteEntity(
                                project._id,
                                config.entityTypes.PROJECT.value
                            ),
                            canAdmin: permissions.canAdminEntity(
                                project._id,
                                config.entityTypes.PROJECT.value
                            )
                        })),
                        catchError(err => of(<UserProjectPermission>DEFAULT_USER_PERMISSION))
                    )
                )
            );

        const emptyUserProjectPermission = this._project
            .pipe(
                filter(project => !project),
                mapTo(DEFAULT_USER_PERMISSION)
            );

        const getUserProjectPermission = merge(
            queryUserProjectPermission,
            emptyUserProjectPermission
        );

        return getUserProjectPermission;
    }

    project(): Observable<Project> {
        return this._project.asObservable();
    }

    /**
     * Returns whether the user can admin the project.
     * @return {Observable<UserProjectPermission>}
     */
    userPermission(): Observable<UserProjectPermission> {
        return this._userPermission.asObservable();
    }

    /**
     * Returns the ACL associated to this project.
     * @return {Observable<boolean>}
     */
    // acl(): Observable<EntityPermission[]> {
    //     return this._acl.asObservable();
    // }
}
