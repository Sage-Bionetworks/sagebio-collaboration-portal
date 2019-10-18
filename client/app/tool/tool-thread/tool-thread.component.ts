import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, forkJoin, combineLatest } from 'rxjs';
import { switchMap, map, take } from 'rxjs/operators';
import { Project } from 'models/entities/project.model';
import { AuthService } from 'components/auth/auth.service';
import { ToolAuthorizationService } from '../tool-authorization.service';
import { ToolDataService } from '../tool-data.service';
import { Thread } from 'models/messaging/thread.model';
import { MessagingService } from 'components/messaging/messaging.service';

@Component({
    selector: 'tool-thread',
    template: require('./tool-thread.html'),
    styles: [require('./tool-thread.scss')],
})
export class ToolThreadComponent implements OnInit {
    private tool$: Observable<Project>;
    private thread$: Observable<Thread>;

    private canEdit = false; // used in html
    private canDelete = false; // used in html

    static parameters = [
        Router,
        ActivatedRoute,
        ToolDataService,
        ToolAuthorizationService,
        AuthService,
        MessagingService,
    ];
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private toolDataService: ToolDataService,
        private toolAuthorizationService: ToolAuthorizationService,
        private authService: AuthService,
        private messagingService: MessagingService
    ) {
        this.tool$ = this.toolDataService.tool();

        this.router.routeReuseStrategy.shouldReuseRoute = function() {
            return false;
        };
    }

    ngOnInit() {
        this.thread$ = this.route.params.pipe(
            switchMap(params => this.messagingService.getThread(params.threadId)),
            take(1)
        );

        const canAdminProject$ = this.tool$.pipe(
            switchMap(project => this.toolAuthorizationService.canAdmin(project._id))
        );

        // TODO Check that the author has Write access
        const isAuthor$ = forkJoin({
            authInfo: this.authService.authInfo().pipe(take(1)),
            thread: this.thread$,
        }).pipe(
            map(res => {
                return res.authInfo.user._id.toString() === res.thread.createdBy._id.toString();
            })
        );

        combineLatest(canAdminProject$, isAuthor$).subscribe(([canAdminProject, isAuthor]) => {
            this.canEdit = canAdminProject || isAuthor;
            this.canDelete = canAdminProject || isAuthor;
        });
    }

    onThreadDeletion(thread: Thread): void {
        console.log('PROJECT-THREAD deleted');
        this.router.navigate(['..'], { relativeTo: this.route });
    }
}
