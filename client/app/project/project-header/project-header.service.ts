import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Project } from 'models/entities/project.model';
import { ProjectHeaderButtonData } from './models/project-header-button-data.model';
import { ProjectDataService } from '../project-data.service';

@Injectable()
export class ProjectHeaderService {
    private _actionButtonData: BehaviorSubject<ProjectHeaderButtonData> = new BehaviorSubject<ProjectHeaderButtonData>(
        null
    );
    private project: Project;

    static parameters = [ProjectDataService];
    constructor(private projectDataService: ProjectDataService) {
        this.projectDataService.project().subscribe(
            project => {
                this.project = project;
            },
            err => console.error(err)
        );
    }

    actionButtonData(): Observable<ProjectHeaderButtonData> {
        return this._actionButtonData.asObservable();
    }

    showNewProjectButton(): void {
        if (this.project) {
            this._actionButtonData.next({
                title: 'New Project',
                routerLink: ['/projects', 'new'],
            });
        }
    }

    showNewInsightButton(): void {
        if (this.project) {
            this._actionButtonData.next({
                title: 'New Insight',
                routerLink: ['/projects', this.project._id, 'insights', 'new'],
            });
        }
    }

    showNewResourceButton(): void {
        if (this.project) {
            this._actionButtonData.next({
                title: 'New Resource',
                routerLink: ['/projects', this.project._id, 'resources', 'new'],
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
