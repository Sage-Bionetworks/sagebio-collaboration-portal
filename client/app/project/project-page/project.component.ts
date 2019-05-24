import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ProjectService } from '../project.service';
import { Project } from '../../../../shared/interfaces/project.model';
import { PageTitleService } from '../../../components/page-title/page-title.service';
import { Observable, forkJoin, combineLatest, of, empty, never } from 'rxjs';
import { filter, map, switchMap, tap, concatMap, mergeMap, catchError } from 'rxjs/operators';

@Component({
    selector: 'project',
    template: require('./project.html'),
    styles: [require('./project.scss')],
})
export class ProjectComponent implements OnInit, OnDestroy {
    private project: Project;

    static parameters = [Router, ActivatedRoute, PageTitleService, ProjectService];
    constructor(private router: Router, private route: ActivatedRoute,
        private pageTitleService: PageTitleService, private projectService: ProjectService) { }

    ngOnInit() {
        const project$ = this.route.params.pipe(
            switchMap(res => this.projectService.getProject(res.id))
        );

        project$
            .subscribe(project => {
                this.project = project;
            });

        // const projectHealth$ = project$.pipe(
        //     switchMap(project => this.projectService.getProjectHealth(project)
        //         .pipe(
        //             catchError(err => {
        //                 // console.log(err);
        //                 // this.notificationService.error('Unable to connect to Data Catalog');
        //                 return of(<ProjectHealth>{});
        //             })
        //         ))
        // );
        //
        // combineLatest(project$, projectHealth$)
        //     .subscribe(([project, projectHealth]) => {
        //         this.projectHealth = projectHealth;
        //         this.project = project;
        //         this.pageTitleService.title = project.name;
        //         // this.catalogStats = stats;
        //         // this.catalog = catalog;
        //         // this.pageTitleService.title = catalog.name;
        //     });
        // this.route.params
        //     .pipe(
        //         switchMap(res => this.projectService.getProject(res.id))
        //     )
        //     .subscribe(project => {
        //         this.pageTitleService.title = project.name;
        //         this.project = project;
        //     });
    }

    ngOnDestroy() { }
}
