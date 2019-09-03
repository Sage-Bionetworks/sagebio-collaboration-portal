import { Component, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { of, from, forkJoin, merge } from 'rxjs';
import { switchMap, map, ignoreElements } from 'rxjs/operators';

import { InsightService } from 'components/insight/insight.service';
import { SecondarySidenavService } from 'components/sidenav/secondary-sidenav/secondary-sidenav.service';

import { UserNotificationService } from '../user-notification.service';
import { EntityPermissionService } from 'components/auth/entity-permission.service';

import { forkJoinWithProgress } from 'components/rxjs/util';
import config from '../../../app/app.constants';



import { UserNotificationBundle } from '../user-notification-view-depricated/node_modules/models/user-notification/user-notification-bundle.model'
import { UserNotification } from 'models/user-notification/user-notification.model'

import { MessageNotification } from 'models/user-notification/message-notificiation.model'
import { EntityNotification } from 'models/user-notification/entity-notificiation.model'
import { EntityAccessNotification } from 'models/user-notification/entity-access-notificiation.model'


// ---------------------------------------------------------------
// TODO: Do not refer to something in app/, instead move ProjectService to components
import { ProjectService } from '../../../app/project/project.service';
// ---------------------------------------------------------------

// import { Project } from 'models/entities/project.model';
// import { Service } from 'models/auth/entity-permission.model';
// import { pickBy, identity } from 'lodash/fp';
// import { SocketService } from 'components/socket/socket.service';
// import { MessageNotification } from '../models/message-notificiation.model';
// import { EntityNotification } from '../models/entity-notificiation.model';
// import { EntityAccessNotification } from '../models/entity-access-notificiation.model';
// import { UserPermissionDataService } from 'components/auth/user-permission-data.service';


@Component({
    selector: 'user-notification-sidenav',
    template: require('./user-notification-sidenav.html'),
    styles: [require('./user-notification-sidenav.scss')]
})

export class UserNotificationSidenavComponent implements OnDestroy {
    // private socketEventName: string;
    private avatarSize = 40;

    private _messagesNotifications: BehaviorSubject<MessageNotification[]> = new BehaviorSubject<MessageNotification[]>([]);
    private _entityNotifications: BehaviorSubject<UserNotificationBundle[]> = new BehaviorSubject<UserNotificationBundle[]>([]);
    private _entityAccessNotifications: BehaviorSubject<UserNotificationBundle[]> = new BehaviorSubject<UserNotificationBundle[]>([]);

    static parameters = [
        SecondarySidenavService,
        UserNotificationService,
        EntityPermissionService,
        ProjectService,
        InsightService
    ];
    constructor(
        private sidenavService: SecondarySidenavService,
        private userNotificationService: UserNotificationService,
        private entityPermissionService: EntityPermissionService,
        private projectService: ProjectService,
        private insightService: InsightService
    ) {
        this.avatarSize = config.avatar.size.mini;
    }

    getAssociatedEntity(notification: EntityNotification) {
        switch (notification.entityType) {
            case config.entityTypes.PROJECT.value:
                return this.projectService.getProject(notification.entityId)
            case config.entityTypes.INSIGHT.value:
                return this.insightService.getInsight(notification.entityId)
            default:
                return of(null)
        }
    }

    getEntityPermission(notification: EntityAccessNotification) {
        return notification.notificationType === config.notificationTypes.ENTITY_ACCESS_NOTIFICATION.value ?
            this.entityPermissionService.queryMine({ _id: notification.entityPermissionId }) : of(null)
    }

    // buildMessageNotificationBundle(notification: MessageNotification) {
    //     return of(notification)
    //         .pipe(
    //             switchMap(n => forkJoin({
    //                 notification: of(notification),
    //                 associatedEntity: of(null)
    //             }))
    //         )
    // }

    getMessagesNotifications() {
        this.userNotificationService.queryMessageNotifications()
            // .pipe(
            //     forkJoinWithProgress,
            //     switchMap(([finalResult, progress]) => merge(
            //         progress.pipe(ignoreElements()),
            //         finalResult
            //     ))
            // )
            .subscribe((messagesNotifications: MessageNotification[]) => {
                console.log('messagesNotifications: ', messagesNotifications);
                this._messagesNotifications.next(messagesNotifications);
            }, err => console.error(err));
    }

    getEntityNotifications() {
        this.userNotificationService.queryEntityNotifications()
            .pipe(
                map(entityNotifications => entityNotifications.map(notification => this.buildEntityNotificationBundle(notification))),
                switchMap(bundles => forkJoinWithProgress(bundles)),
                switchMap(([finalResult, progress]) => merge(
                    progress.pipe(ignoreElements()),
                    finalResult
                ))
            )
            .subscribe((entityNotifications: UserNotificationBundle[]) => {
                console.log('entityNotifications: ', entityNotifications);
                this._entityNotifications.next(entityNotifications);
            }, err => console.error(err));
    }

    buildEntityNotificationBundle(notification: EntityNotification) {
        return of(notification)
            .pipe(
                switchMap(n => forkJoin({
                    notification: of(notification),
                    associatedEntity: this.getAssociatedEntity(n)
                }))
            )
    }

    getEntityAccessNotifications() {
        this.userNotificationService.queryEntityAccessNotifications()
            .pipe(
                map(entityAceessNotifications => entityAceessNotifications.map(notification => this.buildEntityAccessNotificationBundle(notification))),
                switchMap(bundles => forkJoinWithProgress(bundles)),
                switchMap(([finalResult, progress]) => merge(
                    progress.pipe(ignoreElements()),
                    finalResult
                ))
            )
            .subscribe((entityAccessNotifications: UserNotificationBundle[]) => {
                console.log('entityAccessNotifications: ', entityAccessNotifications);
                this._entityAccessNotifications.next(entityAccessNotifications);
            }, err => console.error(err));
    }

    buildEntityAccessNotificationBundle(notification: EntityAccessNotification) {
        return of(notification)
            .pipe(
                switchMap(n => forkJoin({
                    notification: of(notification),
                    associatedEntity: this.getAssociatedEntity(n),
                    entityPermission: this.getEntityPermission(n)
                }))
            )
    }

    ngOnInit() {
        this.getMessagesNotifications()
        this.getEntityNotifications()
        this.getEntityAccessNotifications()
    }

    ngOnDestroy() { }

    close(): void {
        this.sidenavService.close();
    }
}

