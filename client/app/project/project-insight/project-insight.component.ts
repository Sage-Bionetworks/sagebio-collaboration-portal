import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, forkJoin, combineLatest } from 'rxjs';
import { switchMap, map, take } from 'rxjs/operators';
import { Insight } from 'models/entities/insights/insight.model';
import { Project } from 'models/entities/project.model';
import { AuthService } from 'components/auth/auth.service';
import { InsightService } from 'components/insight/insight.service';
import { ProjectAuthorizationService } from '../project-authorization.service';
import { ProjectDataService } from '../project-data.service';

@Component({
    selector: 'project-insight',
    template: require('./project-insight.html'),
    styles: [require('./project-insight.scss')],
})
export class ProjectInsightComponent implements OnInit {
    private project$: Observable<Project>;
    private insight$: Observable<Insight>;

    private canEdit = false; // used in html
    private canDelete = false; // used in html

    static parameters = [
        Router,
        ActivatedRoute,
        ProjectDataService,
        ProjectAuthorizationService,
        InsightService,
        AuthService,
    ];
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private projectDataService: ProjectDataService,
        private projectAuthorizationService: ProjectAuthorizationService,
        private insightService: InsightService,
        private authService: AuthService
    ) {
        this.project$ = this.projectDataService.project();

        this.router.routeReuseStrategy.shouldReuseRoute = function() {
            return false;
        };
    }

    ngOnInit() {
        this.insight$ = this.route.params.pipe(
            switchMap(params => this.insightService.get(params.insightId)),
            take(1)
        );

        const canAdminProject$ = this.project$.pipe(
            switchMap(project => this.projectAuthorizationService.canAdmin(project._id))
        );

        // TODO Check that the author has Write access
        const isAuthor$ = forkJoin({
            authInfo: this.authService.authInfo().pipe(take(1)),
            insight: this.insight$,
        }).pipe(
            map(res => {
                return res.authInfo.user._id.toString() === res.insight.createdBy._id.toString();
            })
        );

        combineLatest(canAdminProject$, isAuthor$).subscribe(([canAdminProject, isAuthor]) => {
            this.canEdit = canAdminProject || isAuthor;
            this.canDelete = canAdminProject || isAuthor;
        });
    }
}
