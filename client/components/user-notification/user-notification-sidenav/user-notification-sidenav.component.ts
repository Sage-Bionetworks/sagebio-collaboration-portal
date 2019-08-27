import { Component, OnInit, OnDestroy } from '@angular/core';
import { from, of, forkJoin, merge } from 'rxjs';
import { mergeMap, map, switchMap, tap, ignoreElements } from 'rxjs/operators';
import { pickBy, identity } from 'lodash/fp';
import { SecondarySidenavService } from 'components/sidenav/secondary-sidenav/secondary-sidenav.service';
import { EntityPermission } from 'models/auth/entity-permission.model';
import { UserPermissionDataService } from 'components/auth/user-permission-data.service';
import { NotificationService } from '../notification.service';

import { Project } from 'models/entities/project.model';
// TODO: Do not refer to something in app/, instead move ProjectService to components
import { ProjectService } from '../../../app/project/project.service';
import { InviteBundle } from '../models/invite-bundle.model';
import { forkJoinWithProgress } from 'components/rxjs/util';
import config from '../../../app/app.constants';

@Component({
    selector: 'user-notification-sidenav',
    template: require('./user-notification-sidenav.html'),
    styles: [require('./user-notification-sidenav.scss')]
})
export class UserNotificationSidenavComponent implements OnDestroy {
    private invites: InviteBundle[] = [];
    private notifications = []
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

        const createInviteBundle = invite => of(invite)
            .pipe(
                switchMap(inv => forkJoin({
                    invite: of(inv),
                    project: this.projectService.getProject(inv.entityId)
                }))
            );

        const getInviteBundles = this.userPermissionDataService.permissions()
            .pipe(
                map(permissions => permissions.getPendingEntityInvites()),
                map(pendingInvites => pendingInvites.map(invite => createInviteBundle(invite))),
                switchMap(invites => forkJoinWithProgress(invites))
            );

        getInviteBundles
            .pipe(
                switchMap(([finalResult, progress]) => merge(
                    progress.pipe(
                        // tap((value) => console.log(`${value} completed`)),
                        ignoreElements()
                    ),
                    finalResult
                ))
            ).subscribe((invites: InviteBundle[]) => {
                this.invites = invites;
                if (this.invites.length < 1) {
                    this.sidenavService.close();
                }
            }, err => console.error(err));

        console.log('this.notificationService: ', this.notificationService);
        const getMessageNotificationBundles = this.notificationService.queryMineMessageNotification()
        console.log('getMessageNotificationBundles: ', getMessageNotificationBundles);
        const getEntityNotificationBundles = this.notificationService.queryMineEntityNotifications()
        const getEntityAccessNotificationBundles = this.notificationService.queryMineEntityAccessNotifications()

        forkJoin([
            getMessageNotificationBundles,
            getEntityNotificationBundles,
            getEntityAccessNotificationBundles
        ]).subscribe(notifications => {
            console.log('notifications: ', notifications);
            this.notifications = notifications
        })

    }

    onInit() {
        console.log('onInit this.notificationService: ', this.notificationService);
        // const getMessageNotificationBundles = this.notificationService.queryMineMessageNotification()
        // console.log('getMessageNotificationBundles: ', getMessageNotificationBundles);
        // const getEntityNotificationBundles = this.notificationService.queryMineEntityNotifications()
        // const getEntityAccessNotificationBundles = this.notificationService.queryMineEntityAccessNotifications()

        // forkJoin([
        //     getMessageNotificationBundles,
        //     getEntityNotificationBundles,
        //     getEntityAccessNotificationBundles
        // ]).subscribe(notifications => {
        //     console.log('notifications: ', notifications);
        //     this.notifications = notifications
        // })
    }
    ngOnDestroy() { }

    close(): void {
        this.sidenavService.close();
    }
}
