import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, forkJoin, of, merge, Observable, Subscription, Subject, combineLatest } from 'rxjs';
import { switchMap, filter, tap, mapTo, last, pairwise, takeUntil, map, catchError, distinctUntilChanged } from 'rxjs/operators';
import { Project } from 'models/project.model';
import { UserPermissionDataService } from 'components/auth/user-permission-data.service';
import { EntityPermission } from 'models/auth/entity-permission.model';
import { EntityPermissionService } from 'components/auth/entity-permission.service';
import { SocketService } from 'components/socket/socket.service';
import config from '../../app/app.constants';

interface ProjectAclResult {
    project: Project;
    acl: EntityPermission[];
}

@Injectable()
export class ProjectDataService implements OnDestroy {
    private _project: BehaviorSubject<Project> = new BehaviorSubject<Project>(null);
    private _canAdmin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private _acl: BehaviorSubject<EntityPermission[]> = new BehaviorSubject<EntityPermission[]>([]);
    private unsubscribe = new Subject<void>();

    static parameters = [UserPermissionDataService, EntityPermissionService,
        SocketService];
    constructor(private userPermissionDataService: UserPermissionDataService,
        private entityPermissionService: EntityPermissionService,
        private socketService: SocketService) {

        // this._project
        //     .pipe(
        //         pairwise(),
        //         map(data => ({
        //             prevProject: data[0],
        //             project: data[1]
        //         })),
        //         tap(res => {
        //             if (res.prevProject) {
        //                 this.socketService.unsyncUpdates(`project:${res.prevProject._id}`);
        //             }
        //         }),
        //         takeUntil(this.unsubscribe)
        //     )
        //     .subscribe(res => {
        //         if (res.project && ) {
        //             this.socketService.syncItemSubject(`project:${res.project._id}`, this._project);
        //         }
        //     }, err => console.log(err), () => {
        //         let project = this._project.getValue();
        //         if (project) {
        //             this.socketService.unsyncUpdates(`project:${project._id}`);
        //         }
        //     });


        this.getCanAdmin()
            .pipe(
                takeUntil(this.unsubscribe)
            )
            .subscribe(canAdmin => {
                this._canAdmin.next(canAdmin);
            }, err => console.log(err), () => {
                this._canAdmin.next(false);
                this._canAdmin.complete();
            });

        this.getACL()
            .pipe(
                takeUntil(this.unsubscribe)
            )
            .subscribe((res: ProjectAclResult) => {
                console.log('ACL are now', res);
                this._acl.next(res.acl);
                if (res.project) {
                    this.socketService.syncArraySubject(`project:${res.project._id}:entityPermission`, this._acl);
                }
            }, err => console.log(err), () => {
                this._acl.next([]);
                this._acl.complete();
            });
    }

    ngOnDestroy() {
        this._project.next(null);
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    public setProject(project: Project): void {
        this._project.next(project);
    }

    private getACL(): Observable<ProjectAclResult> {

        const getProjectAndCanAdmin = combineLatest(
            this._project
                .pipe(
                    pairwise()
                ),
            this._canAdmin
        )
            .pipe(
                map(data => ({
                    prevProject: data[0][0],
                    project: data[0][1],
                    canAdmin: data[1]
                }))
            );

        const queryACL = getProjectAndCanAdmin
            .pipe(
                filter(res => !!res.project && res.canAdmin),
                switchMap(res => forkJoin({
                    project: of(res.project),
                    acl: this.entityPermissionService.queryByEntity(res.project)
                })),
                tap(res => console.log('SET ACL', res))
            );

        const emptyACL = getProjectAndCanAdmin
            .pipe(
                filter(res => !res.project || !res.canAdmin),
                distinctUntilChanged((prev, curr) => {
                    return (!prev.project || !prev.canAdmin) !== (!curr.project || !curr.canAdmin);
                }),
                tap(res => {

                }),
                mapTo({
                    project: <Project>null,
                    acl: <EntityPermission[]>[]
                }),
                tap(() => console.log('EMPTY ACL'))
            );

        const getACL = merge(
            queryACL,
            emptyACL
        );

        return getACL;
        // .pipe(
        //     tap((res: ProjectAclResult) => {
        //         this._acl.next(res.acl);
        //         if (res.project) {
        //             this.socketService.syncArraySubject(`project:${res.project._id}`, this._acl);
        //         }
        //     })
        // );
    }

    /**
     * Returns whether the user can admin this project.
     * @return {Observable<boolean>}
     */
    private getCanAdmin(): Observable<boolean> {
        const queryCanAdminProject = this._project
            .pipe(
                filter(project => !!project),
                switchMap(project => this.userPermissionDataService.getPermissions()
                    .pipe(
                        map(permissions => permissions.canAdminEntity(
                            project._id,
                            config.entityTypes.PROJECT.value
                        )),
                        catchError(err => of(<boolean>false))
                    )
                )
            );

        const emptyCanAdminProject = this._project
            .pipe(
                filter(project => !project),
                mapTo(false)
            );

        const canAdminProject = merge(
            queryCanAdminProject,
            emptyCanAdminProject
        );

        return canAdminProject;
    }

    /**
     * Returns whether the user can admin the project.
     * @return {Observable<boolean>}
     */
    canAdmin(): Observable<boolean> {
        return this._canAdmin.asObservable();
    }

    /**
     * Returns the ACL associated to this project.
     * @return {Observable<boolean>}
     */
    acl(): Observable<EntityPermission[]> {
        return this._acl.asObservable();
    }
}
