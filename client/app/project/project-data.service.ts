import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, forkJoin, of, merge } from 'rxjs';
import { switchMap, filter, tap, mapTo, last } from 'rxjs/operators';
import { AuthService } from 'components/auth/auth.service';
import { Project } from 'models/project.model';
import { EntityPermission } from 'models/auth/entity-permission.model';
import { EntityPermissionService } from 'components/auth/entity-permission.service';
import { SocketService } from 'components/socket/socket.service';
import config from '../../app/app.constants';

@Injectable()
export class ProjectDataService implements OnDestroy {
    private _project: BehaviorSubject<Project> = new BehaviorSubject<Project>(null);
    private _acl: BehaviorSubject<EntityPermission[]> = new BehaviorSubject<EntityPermission[]>([]);

    static parameters = [AuthService, EntityPermissionService, SocketService];
    constructor(private authService: AuthService,
        private entityPermissionService: EntityPermissionService,
        private socketService: SocketService) {

        this.initACL();
    }

    ngOnDestroy() {
        this._project.complete();
    }

    setProject(project: Project): void {
        this._project.next(project);
    }

    initACL(): void {
        // TODO: Only project admin should get the acl
        const queryACL = this._project
            .pipe(
                filter(project => !!project),
                switchMap(project => forkJoin({
                    project: of(project),
                    acl: this.entityPermissionService.queryByEntity(project)
                })),
                tap(res => console.log('ACL', res))
            );

        const destroyACL = this._project
            .pipe(
                last(),
                tap(project => {
                    this.socketService.unsyncUpdates(`project:${project._id}`);
                }),
                tap(() => 'ACL DESTROYED'),
                mapTo({
                    project: <Project>null,
                    acl: <EntityPermission[]>[]
                })
            );

        const getACL = merge(
            queryACL,
            destroyACL
        );

        getACL
            .subscribe(res => {
                this._acl.next(res.acl);
                if (res.project) {
                    this.socketService.syncArraySubject(`project:${res.project._id}`, this._acl);
                }
            }, err => console.log(err));
    }
}
