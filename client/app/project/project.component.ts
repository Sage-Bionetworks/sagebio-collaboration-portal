import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { Project } from 'models/entities/project.model';
import { ProjectService } from './project.service';
import { ProjectDataService } from './project-data.service';
import { ProjectHeaderService } from './project-header/project-header.service';
import { ProjectSidenavService } from './project-sidenav/project-sidenav.service';
import { ProjectAuthorizationService } from './project-authorization.service';

@Component({
    selector: 'project',
    template: require('./project.html'),
    styles: [require('./project.scss')],
    providers: [ProjectDataService, ProjectAuthorizationService, ProjectHeaderService, ProjectSidenavService],
})
export class ProjectComponent implements OnInit {
    private project$: Observable<Project>; // used in html

    static parameters = [ActivatedRoute, ProjectService, ProjectDataService, ProjectSidenavService];
    constructor(
        private route: ActivatedRoute,
        private projectService: ProjectService,
        private projectDataService: ProjectDataService,
        private projectSidenavService: ProjectSidenavService
    ) {}

    ngOnInit() {
        const getProject = this.route.params.pipe(
            tap(res => console.log('RES', res)),
            switchMap(res =>
                this.projectService.get(res.id).pipe(
                    catchError(err => {
                        console.error(err);
                        return of(<Project>undefined);
                    })
                )
            )
        );

        getProject.subscribe(project => {
            this.projectDataService.setProject(project);
        });

        this.project$ = this.projectDataService.project();
    }
}
