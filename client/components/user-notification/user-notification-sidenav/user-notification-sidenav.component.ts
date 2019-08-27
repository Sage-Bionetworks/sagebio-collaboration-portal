import { Component, OnDestroy } from '@angular/core';
import { merge, Observable } from 'rxjs';
import { SecondarySidenavService } from 'components/sidenav/secondary-sidenav/secondary-sidenav.service';
import { UserPermissionDataService } from 'components/auth/user-permission-data.service';
import { NotificationService } from '../notification.service';
import { EntityAccessNotification } from 'models/auth/notificiation.model';
import { MessageNotification } from 'models/auth/notificiation.model';
import { EntityNotification } from 'models/auth/notificiation.model';

// TODO: Do not refer to something in app/, instead move ProjectService to components
import { ProjectService } from '../../../app/project/project.service';
import { InviteBundle } from '../models/invite-bundle.model';
import config from '../../../app/app.constants';

// import { forkJoinWithProgress } from 'components/rxjs/util';
// import { Project } from 'models/entities/project.model';
// import { EntityPermission } from 'models/auth/entity-permission.model';
// import { mergeMap, map, switchMap, tap, ignoreElements } from 'rxjs/operators';
// import { pickBy, identity } from 'lodash/fp';
// import { from, of, forkJoin, merge } from 'rxjs';


@Component({
    selector: 'user-notification-sidenav',
    template: require('./user-notification-sidenav.html'),
    styles: [require('./user-notification-sidenav.scss')]
})

export class UserNotificationSidenavComponent implements OnDestroy {
    private invites: InviteBundle[] = [];
    private notifications: EntityAccessNotification | MessageNotification | EntityNotification = []
    private avatarSize = 40;

    static parameters = [
        SecondarySidenavService,
        UserPermissionDataService,
        ProjectService,
        NotificationService
    ];
    constructor(
        private sidenavService: SecondarySidenavService,
        private userPermissionDataService: UserPermissionDataService,
        private projectService: ProjectService,
        private notificationService: NotificationService
    ) {
        this.avatarSize = config.avatar.size.mini;

        // const createInviteBundle = invite => of(invite)
        //     .pipe(
        //         switchMap(inv => forkJoin({
        //             invite: of(inv),
        //             project: this.projectService.getProject(inv.entityId)
        //         }))
        //     );

        // const getInviteBundles = this.userPermissionDataService.permissions()
        //     .pipe(
        //         map(permissions => permissions.getPendingEntityInvites()),
        //         map(pendingInvites => pendingInvites.map(invite => createInviteBundle(invite))),
        //         switchMap(invites => forkJoinWithProgress(invites))
        //     );

        // getInviteBundles
        //     .pipe(
        //         switchMap(([finalResult, progress]) => merge(
        //             progress.pipe(
        //                 // tap((value) => console.log(`${value} completed`)),
        //                 ignoreElements()
        //             ),
        //             finalResult
        //         ))
        //     ).subscribe((invites: InviteBundle[]) => {
        //         this.invites = invites;
        //         if (this.invites.length < 1) {
        //             this.sidenavService.close();
        //         }
        //     }, err => console.error(err));

        const getMessageNotificationBundles = this.notificationService.queryMineMessageNotification()
        const getEntityNotificationBundles = this.notificationService.queryMineEntityNotifications()
        const getEntityAccessNotificationBundles = this.notificationService.queryMineEntityAccessNotifications()

        merge([
            getMessageNotificationBundles,
            getEntityNotificationBundles,
            getEntityAccessNotificationBundles
        ]).subscribe((notifications: Observable<EntityAccessNotification[] | MessageNotification[] | EntityNotification[]>) => {
            console.log('notifications: ', notifications);
            this.notifications = notifications
        })

    }

    ngOnDestroy() { }

    close(): void {
        this.sidenavService.close();
    }
}
