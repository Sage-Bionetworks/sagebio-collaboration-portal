import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, forkJoin, combineLatest } from 'rxjs';
import { switchMap, map, take } from 'rxjs/operators';
import { Resource } from 'models/entities/resources/resource.model';
import { Project } from 'models/entities/project.model';
import { AuthService } from 'components/auth/auth.service';
import { ResourceService } from 'components/resource/resource.service';
import { ProjectAuthorizationService } from '../project-authorization.service';
import { ProjectDataService } from '../project-data.service';

@Component({
    selector: 'project-resource',
    template: require('./project-resource.html'),
    styles: [require('./project-resource.scss')],
})
export class ProjectResourceComponent implements OnInit {
    private project$: Observable<Project>;
    private resource$: Observable<Resource>;

    private canEdit = false; // used in html
    private canDelete = false; // used in html

    static parameters = [
        Router,
        ActivatedRoute,
        ProjectDataService,
        ProjectAuthorizationService,
        ResourceService,
        AuthService,
    ];
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private projectDataService: ProjectDataService,
        private projectAuthorizationService: ProjectAuthorizationService,
        private resourceService: ResourceService,
        private authService: AuthService
    ) {
        this.project$ = this.projectDataService.project();

        this.router.routeReuseStrategy.shouldReuseRoute = function() {
            return false;
        };
    }

    ngOnInit() {
        this.resource$ = this.route.params.pipe(
            switchMap(params => this.resourceService.get(params.resourceId)),
            take(1)
        );

        const canAdminProject$ = this.project$.pipe(
            switchMap(project => this.projectAuthorizationService.canAdmin(project._id))
        );

        const isAuthor$ = forkJoin({
            authInfo: this.authService.authInfo().pipe(take(1)),
            resource: this.resource$,
        }).pipe(
            map(res => {
                return res.authInfo.user._id.toString() === res.resource.createdBy._id.toString();
            })
        );

        combineLatest(canAdminProject$, isAuthor$).subscribe(([canAdminProject, isAuthor]) => {
            this.canEdit = canAdminProject || isAuthor;
            this.canDelete = canAdminProject;
        });
    }
}
