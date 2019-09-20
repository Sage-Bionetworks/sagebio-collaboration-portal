import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Resource } from 'models/entities/resources/resource.model';
import { Project } from 'models/entities/project.model';
import { ProjectDataService } from '../project-data.service';

@Component({
    selector: 'project-resource-new',
    template: require('./project-resource-new.html'),
    styles: [require('./project-resource-new.scss')],
})
export class ProjectResourceNewComponent {
    private project$: Observable<Project>; // used in html

    static parameters = [Router, ProjectDataService];
    constructor(private router: Router, private projectDataService: ProjectDataService) {
        this.project$ = this.projectDataService.project();
    }

    onNewResource(resource: Resource): void {
        if (resource) {
            this.router.navigate(['/projects', resource.projectId, 'resources', resource._id]);
        }
    }

    onCancel(project: Project): void {
        if (project) {
            this.router.navigate(['/projects', project._id, 'resources']);
        }
    }
}
