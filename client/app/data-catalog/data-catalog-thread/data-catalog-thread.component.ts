import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, forkJoin, combineLatest } from 'rxjs';
import { switchMap, map, take, mapTo } from 'rxjs/operators';
import { Project } from 'models/entities/project.model';
import { Thread } from 'models/messaging/thread.model';
import { AuthService } from 'components/auth/auth.service';
import { MessagingService } from 'components/messaging/messaging.service';
import { DataCatalogAuthorizationService } from '../data-catalog-authorization.service';
import { DataCatalog } from 'models/entities/data-catalog.model';
import { DataCatalogService } from '../data-catalog.service';

@Component({
    selector: 'data-catalog-thread',
    template: require('./data-catalog-thread.html'),
    styles: [require('./data-catalog-thread.scss')],
})
export class DataCatalogThreadComponent implements OnInit {
    private dataCatalog$: Observable<DataCatalog>;
    private thread$: Observable<Thread>;

    private canEdit = false; // used in html
    private canDelete = false; // used in html

    static parameters = [
        Router,
        ActivatedRoute,
        DataCatalogService,
        DataCatalogAuthorizationService,
        AuthService,
        MessagingService,
    ];
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private dataCatalogService: DataCatalogService,
        private dataCatalogAuthorizationService: DataCatalogAuthorizationService,
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

        this.dataCatalog$ = this.route.params.pipe(
            switchMap(params => this.dataCatalogService.get(params.id)),
            take(1)
        );

        const canAdminDataCatalog$ = this.dataCatalog$.pipe(
            switchMap(dataCatalog => this.dataCatalogAuthorizationService.canAdmin(dataCatalog._id))
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

        combineLatest(canAdminDataCatalog$, isAuthor$).subscribe(([canAdminProject, isAuthor]) => {
            this.canEdit = canAdminProject || isAuthor;
            this.canDelete = canAdminProject || isAuthor;
        });
    }

    onThreadDeletion(thread: Thread): void {
        this.router.navigate(['..'], { relativeTo: this.route });
    }
}
