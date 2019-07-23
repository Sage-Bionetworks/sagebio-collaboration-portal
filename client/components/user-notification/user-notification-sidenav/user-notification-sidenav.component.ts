import { Component, OnDestroy } from '@angular/core';
import { from, of, forkJoin, defer, Subject, merge } from 'rxjs';
import { mergeMap, map, switchMap, catchError, tap, finalize, ignoreElements } from 'rxjs/operators';
import { pickBy, identity } from 'lodash/fp';
import { SecondarySidenavService } from 'components/sidenav/secondary-sidenav/secondary-sidenav.service';
import { EntityPermission } from 'models/auth/entity-permission.model';
import { UserPermissionDataService } from 'components/auth/user-permission-data.service';
import { Project } from 'models/project.model';
import { ProjectService } from '../../../app/project/project.service';
// TODO: Do not refer to something in app/, instead move ProjectService to components

@Component({
    selector: 'user-notification-sidenav',
    template: require('./user-notification-sidenav.html'),
    styles: [require('./user-notification-sidenav.scss')]
})
export class UserNotificationSidenavComponent implements OnDestroy {
    private invites: EntityPermission[] = [];
    private projects: Project[] = [];

    static parameters = [SecondarySidenavService, UserPermissionDataService,
        ProjectService];
    constructor(private sidenavService: SecondarySidenavService,
        private userPermissionDataService: UserPermissionDataService,
        private projectService: ProjectService) {

        // const getInvites = this.userPermissionDataService.permissions()
        //     .pipe(
        //         switchMap(permissions => of(permissions.getPendingEntityInvites()))
        //     );
        //
        // getInvites
        //     .subscribe(invites => {
        //         // console.log(invites);
        //         this.invites = invites;
        //     });

        const getInvitesAsObservablesList = this.userPermissionDataService.permissions()
            .pipe(
                map(permissions => permissions.getPendingEntityInvites().map(invite => of(invite)))
            );

        function forkJoinWithProgress(arrayOfObservables) {

            return defer(() => {
                let counter = 0;
                const percent$ = new Subject();

                const modilefiedObservablesList = arrayOfObservables.map(
                    (item, index) => item.pipe(
                        finalize(() => {
                            const percentValue = ++counter * 100 / arrayOfObservables.length;
                            percent$.next(percentValue);
                        })
                    )
                );

                const finalResult$ = forkJoin(modilefiedObservablesList).pipe(
                    tap(() => {
                        percent$.next(100);
                        percent$.complete();
                    }
                    ));

                return of([finalResult$, percent$.asObservable()]);
            });
        }

        const getUserDetails = userIdsList => {

            const arrayOfObservables = userIdsList.map((userId, index) => {
                //if (index === 1) return throwError({message: 'Vah-vah!'}); // testin with error

                // return ajax('https://jsonplaceholder.typicode.com/comments/' + userId)
                return of(userId)
            })

            return forkJoinWithProgress(arrayOfObservables)
        }

        // const result$ = getUserDetails([1, 2, 15]);
        const result$ = getInvitesAsObservablesList;

        result$.pipe(
            mergeMap(([finalResult, progress]) => merge(
                progress.pipe(
                    tap((value) => console.log(`${value} completed`)),
                    ignoreElements()
                ),
                finalResult
            ))
        ).subscribe(values => {
            console.log(values);
            // this.projects = projects;
            // console.log('projects', project);
        }, console.warn);
    }

    ngOnDestroy() { }

    close(): void {
        this.sidenavService.close();
        // this.sidenavService.destroyContentComponent();
    }

    forkJoinWithProgress(arrayOfObservables) {

        return defer(() => {
            let counter = 0;
            const percent$ = new Subject();

            console.log('arrayOfObservables', arrayOfObservables);

            const modilefiedObservablesList = arrayOfObservables.map(
                (item, index) => item.pipe(
                    finalize(() => {
                        const percentValue = ++counter * 100 / arrayOfObservables.length;
                        percent$.next(percentValue);
                    })
                )
            );

            const finalResult$ = forkJoin(modilefiedObservablesList).pipe(
                tap(() => {
                    percent$.next(100);
                    percent$.complete();
                }
                ));

            return of([finalResult$, percent$.asObservable()]);
        });
    }
}
