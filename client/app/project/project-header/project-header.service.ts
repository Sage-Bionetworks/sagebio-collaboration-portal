import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Project } from 'models/entities/project.model';
import { ProjectHeaderButtonData } from './models/project-header-button-data.model';
import { ProjectDataService } from '../project-data.service';
import { ProjectAuthorizationService } from '../project-authorization.service';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class ProjectHeaderService implements OnDestroy {
    private _actionButtonData: BehaviorSubject<ProjectHeaderButtonData> = new BehaviorSubject<ProjectHeaderButtonData>(
        null
    );
    private project: Project;
    private canWriteProject = false;

    private projectSub: Subscription;
    private canWriteProjectSub: Subscription;

    static parameters = [ProjectDataService, ProjectAuthorizationService];
    constructor(
        private projectDataService: ProjectDataService,
        private projectAuthorizationService: ProjectAuthorizationService
    ) {
        this.projectDataService.project().subscribe(
            project => {
                this.project = project;
            },
            err => console.error(err)
        );

        this.canWriteProjectSub = this.projectDataService
            .project()
            .pipe(switchMap(project => this.projectAuthorizationService.canWrite(project._id)))
            .subscribe(canWrite => {
                this.canWriteProject = canWrite;
            });
    }

    ngOnDestroy() {
        if (this.projectSub) {
            this.projectSub.unsubscribe();
        }
    }

    actionButtonData(): Observable<ProjectHeaderButtonData> {
        return this._actionButtonData.asObservable();
    }

    // showNewProjectButton(): void {
    //     this._actionButtonData.next({
    //         title: 'New Project',
    //         routerLink: ['/projects', 'new'],
    //         locked: false,
    //     });
    // }

    showNewInsightButton(): void {
        if (this.project) {
            this._actionButtonData.next({
                title: 'New Insight',
                routerLink: ['/projects', this.project._id, 'insights', 'new'],
                unauthorized: !this.canWriteProject,
                unauthorizedMessage: `You don't have permission to create an Insight.`
            });
        }
    }

    showNewResourceButton(): void {
        if (this.project) {
            this._actionButtonData.next({
                title: 'New Resource',
                routerLink: ['/projects', this.project._id, 'resources', 'new'],
                unauthorized: !this.canWriteProject,
                unauthorizedMessage: `You don't have permission to create a Resource.`
            });
        }
    }

    showNewDiscussionButton(): void {
        if (this.project) {
            this._actionButtonData.next({
                title: 'New Thread',
                routerLink: ['/projects', this.project._id, 'discussion', 'new'],
            });
        }
    }

    hideActionButton(): void {
        this._actionButtonData.next(null);
    }
}
