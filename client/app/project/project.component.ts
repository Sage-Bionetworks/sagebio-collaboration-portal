import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Project } from 'models/project.model';
import { ProjectService } from './project.service';
import { ProjectDataService } from './project-data.service';
import { ProjectSidenavService } from './project-sidenav/project-sidenav.service';

@Component({
    selector: 'project',
    template: require('./project.html'),
    styles: [require('./project.scss')],
    providers: [
        ProjectDataService
    ]
})
export class ProjectComponent implements OnInit {
    private project: Observable<Project>;

    static parameters = [ActivatedRoute, ProjectService, ProjectDataService,
        ProjectSidenavService];
    constructor(private route: ActivatedRoute,
        private projectService: ProjectService,
        private projectDataService: ProjectDataService,
        private projectSidenavService: ProjectSidenavService) { }

    ngOnInit() {
        const project$ = this.route.params.pipe(
            switchMap(res => this.projectService.getProject(res.id))
        );

        project$
            .subscribe(project => {
                this.projectDataService.setProject(project);
            });

        this.project = this.projectDataService.project();
    }
}
