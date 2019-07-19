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

        this.getCanAdmin()
            .pipe(
                takeUntil(this.unsubscribe)
            )
            .subscribe(canAdmin => {
                this._canAdmin.next(canAdmin);
            }, err => console.log(err), () => {
                this._canAdmin.next(false);
            });

        this.getACL()
            .pipe(
                takeUntil(this.unsubscribe)
            )
            .subscribe(() => {
                //
            }, err => console.log(err), () => {
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
                tap(res => {
                    if (res.prevProject) {
                        this.socketService.unsyncUpdates(`project:${res.prevProject._id}`);
                    }
                }),
                switchMap(res => forkJoin({
                    project: of(res.project),
                    acl: this.entityPermissionService.queryByEntity(res.project)
                })),
                tap(() => console.log('SET ACL'))
            );

        const emptyACL = getProjectAndCanAdmin
            .pipe(
                filter(res => !res.project || !res.canAdmin),
                distinctUntilChanged((prev, curr) => {
                    return (!prev.project || !prev.canAdmin) === (!curr.project || !curr.canAdmin);
                }),
                tap(res => {
                    if (res.prevProject) {
                        this.socketService.unsyncUpdates(`project:${res.prevProject._id}`);
                    }
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

        return getACL
            .pipe(
                tap((res: ProjectAclResult) => {
                    this._acl.next(res.acl);
                    if (res.project) {
                        this.socketService.syncArraySubject(`project:${res.project._id}`, this._acl);
                    }
                })
            );
    }

    getCanAdmin(): Observable<boolean> {
        const queryCanAdminProject = this._project
            .pipe(
                tap(() => console.log('queryCanAdminProject')),
                filter(project => !!project),
                switchMap(project => this.userPermissionDataService.getPermissions()
                    .pipe(
                        tap(() => console.log('CHECKING if user can admin')),
                        map(permissions => permissions.canAdminProject(project)),
                        catchError(err => of(<boolean>false))
                    )
                )
            );

        const emptyCanAdminProject = this._project
            .pipe(
                filter(project => !project),
                tap(project => console.log('bad project', project)),
                mapTo(false),
                tap(() => console.log('YOU ARE NOT ALLOWED TO SEE PERMISSION'))
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
