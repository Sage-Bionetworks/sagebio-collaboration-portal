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
import { Thread } from 'models/messaging/thread.model';
import { MessagingService } from 'components/messaging/messaging.service';

@Component({
    selector: 'project-thread',
    template: require('./project-thread.html'),
    styles: [require('./project-thread.scss')],
})
export class ProjectThreadComponent implements OnInit {
    private project$: Observable<Project>;
    private thread$: Observable<Thread>;

    private canEdit = false; // used in html
    private canDelete = false; // used in html

    static parameters = [
        Router,
        ActivatedRoute,
        ProjectDataService,
        MessagingService,
        // ProjectAuthorizationService,
        // InsightService,
        // AuthService,
    ];
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private projectDataService: ProjectDataService,
        private messagingService: MessagingService
    ) // private projectAuthorizationService: ProjectAuthorizationService,
    // private insightService: InsightService,
    // private authService: AuthService
    {
        this.project$ = this.projectDataService.project();

        this.router.routeReuseStrategy.shouldReuseRoute = function() {
            return false;
        };
    }

    ngOnInit() {
        this.thread$ = this.route.params.pipe(
            switchMap(params => this.messagingService.getThread(params.threadId)),
            take(1)
        );

        // const canAdminProject$ = this.project$.pipe(
        //     switchMap(project => this.projectAuthorizationService.canAdmin(project._id))
        // );

        // // TODO Check that the author has Write access
        // const isAuthor$ = forkJoin({
        //     authInfo: this.authService.authInfo().pipe(take(1)),
        //     insight: this.insight$,
        // }).pipe(
        //     map(res => {
        //         return res.authInfo.user._id.toString() === res.insight.createdBy._id.toString();
        //     })
        // );

        // combineLatest(canAdminProject$, isAuthor$).subscribe(([canAdminProject, isAuthor]) => {
        //     this.canEdit = canAdminProject || isAuthor;
        //     this.canDelete = canAdminProject || isAuthor;
        // });
    }
}
