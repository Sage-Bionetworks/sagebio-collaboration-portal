import { Component, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SecondarySidenavService } from 'components/sidenav/secondary-sidenav/secondary-sidenav.service';
import { UserPermissionDataService } from 'components/auth/user-permission-data.service';
import { UserNotificationService } from '../user-notification.service';
import { MessageNotification } from '../models/message-notificiation.model';
import { EntityNotification } from '../models/entity-notificiation.model';
import { EntityAccessNotification } from '../models/entity-access-notificiation.model';
import { mergeMap, map, switchMap, tap, ignoreElements } from 'rxjs/operators';

// TODO: Do not refer to something in app/, instead move ProjectService to components
import { ProjectService } from '../../../app/project/project.service';
import { InsightService } from 'components/insight/insight.service'
import config from '../../../app/app.constants';

// import { InviteBundle } from '../models/invite-bundle.model';
// import { forkJoinWithProgress } from 'components/rxjs/util';
// import { Project } from 'models/entities/project.model';
// import { EntityPermission } from 'models/auth/entity-permission.model';
// import { pickBy, identity } from 'lodash/fp';
// import { from, of, forkJoin, merge } from 'rxjs';
// import { SocketService } from 'components/socket/socket.service';



@Component({
    selector: 'user-notification-sidenav',
    template: require('./user-notification-sidenav.html'),
    styles: [require('./user-notification-sidenav.scss')]
})

export class UserNotificationSidenavComponent implements OnDestroy {
    // private invites: InviteBundle[] = [];
    private avatarSize = 40;

    private _messages: BehaviorSubject<MessageNotification[]> = new BehaviorSubject<MessageNotification[]>([]);
    private _entityInvites: BehaviorSubject<EntityNotification[]> = new BehaviorSubject<EntityNotification[]>([]);
    private _entityAccessInvites: BehaviorSubject<EntityAccessNotification[]> = new BehaviorSubject<EntityAccessNotification[]>([]);

    // private socketEventName: string;

    static parameters = [
        SecondarySidenavService,
        UserPermissionDataService,
        UserNotificationService,
        InsightService,
        ProjectService
    ];
    constructor(
        private sidenavService: SecondarySidenavService,
        private userPermissionDataService: UserPermissionDataService,
        private userNotificationService: UserNotificationService,
        private projectService: ProjectService,
        private insightService: InsightService
    ) {
        this.avatarSize = config.avatar.size.mini;
    }


    ngOnInit() {
        this.userNotificationService.queryMessageNotifications()
            .subscribe(messages => {
                this._messages.next(messages);
                console.log('this._messages: ', this._messages);
            }, err => console.error(err));
        this.userNotificationService.queryEntityNotifications()
            .subscribe(entityInvites => {
                this._entityInvites.next(entityInvites);
            }, err => console.error(err));
        this.userNotificationService.queryEntityAccessNotifications()
            .subscribe(entityAccessInvites => {
                this._entityAccessInvites.next(entityAccessInvites);
            }, err => console.error(err));
    }



    ngOnDestroy() { }

    close(): void {
        this.sidenavService.close();
    }
}

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