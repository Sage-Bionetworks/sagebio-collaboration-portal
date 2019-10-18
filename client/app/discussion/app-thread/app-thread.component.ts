import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, forkJoin, combineLatest, of } from 'rxjs';
import { switchMap, map, take, mapTo } from 'rxjs/operators';
import { Thread } from 'models/messaging/thread.model';
import { AuthService } from 'components/auth/auth.service';
import { MessagingService } from 'components/messaging/messaging.service';
import { App } from 'models/entities/app.model';
import { AppService } from '../../app.service';

@Component({
    selector: 'app-thread',
    template: require('./app-thread.html'),
    styles: [require('./app-thread.scss')],
})
export class AppThreadComponent implements OnInit {
    private thread$: Observable<Thread>;

    private canEdit = false; // used in html
    private canDelete = false; // used in html

    static parameters = [Router, ActivatedRoute, AppService, AuthService, MessagingService];
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private appService: AppService,
        private authService: AuthService,
        private messagingService: MessagingService
    ) {
        this.router.routeReuseStrategy.shouldReuseRoute = function() {
            return false;
        };
    }

    ngOnInit() {
        this.thread$ = this.route.params.pipe(
            switchMap(params => this.messagingService.getThread(params.threadId)),
            take(1)
        );

        // TODO Change once authorization service added for App
        const canAdminApp$ = of(false);

        // TODO Check that the author has Write access
        const isAuthor$ = forkJoin({
            authInfo: this.authService.authInfo().pipe(take(1)),
            thread: this.thread$,
        }).pipe(
            map(res => {
                return res.authInfo.user._id.toString() === res.thread.createdBy._id.toString();
            })
        );

        combineLatest(canAdminApp$, isAuthor$).subscribe(([canAdminProject, isAuthor]) => {
            this.canEdit = canAdminProject || isAuthor;
            this.canDelete = canAdminProject || isAuthor;
        });
    }

    onThreadDeletion(thread: Thread): void {
        this.router.navigate(['..'], { relativeTo: this.route });
    }
}
