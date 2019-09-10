import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Insight } from 'models/entities/insights/insight.model';
import { Project } from 'models/entities/project.model';
import { ProjectDataService } from '../project-data.service';

@Component({
    selector: 'project-insight-new',
    template: require('./project-insight-new.html'),
    styles: [require('./project-insight-new.scss')],
})
export class ProjectInsightNewComponent {
    private project$: Observable<Project>; // used in html

    static parameters = [Router, ProjectDataService];
    constructor(private router: Router, private projectDataService: ProjectDataService) {
        this.project$ = this.projectDataService.project();
    }

    onNewInsight(insight: Insight): void {
        if (insight) {
            this.router.navigate(['/projects', insight.projectId, 'insights', insight._id]);
        }
    }

    onCancel(project: Project): void {
        if (project) {
            this.router.navigate(['/projects', project._id, 'insights']);
        }
    }
}
