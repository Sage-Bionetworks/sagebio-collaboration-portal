import { Component, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { of, forkJoin, merge } from 'rxjs';
import { switchMap, map, ignoreElements } from 'rxjs/operators';

import { InsightService } from 'components/insight/insight.service';
import { SecondarySidenavService } from 'components/sidenav/secondary-sidenav/secondary-sidenav.service';

import { UserNotificationService } from '../user-notification.service';
import { EntityPermissionService } from 'components/auth/entity-permission.service';

import { forkJoinWithProgress } from 'components/rxjs/util';
import config from '../../../app/app.constants';

import { UserNotificationBundle } from 'models/user-notification/user-notification-bundle.model'
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
    private _entityNotifications: BehaviorSubject<UserNotificationBundle<EntityNotification>[]> = new BehaviorSubject<UserNotificationBundle<EntityNotification>[]>([]);
    private _entityAccessNotifications: BehaviorSubject<UserNotificationBundle<EntityAccessNotification>[]> = new BehaviorSubject<UserNotificationBundle<EntityAccessNotification>[]>([]);

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
            case config.entityTypes.RESOURCE.value:
            case config.entityTypes.TOOL.value:
            case config.entityTypes.DATA_CATALOG.value:
            default:
                return of(null)
        }
    }

    getEntityPermission(notification: EntityAccessNotification) {
        return notification.notificationType === config.notificationTypes.ENTITY_ACCESS_NOTIFICATION.value
            ? this.entityPermissionService.getPermission(notification.entityPermissionId as string)
            : of(null)
    }

    getMessagesNotifications() {
        this.userNotificationService.queryNotifications({
            notificationType: config.notificationTypes.MESSAGE_NOTIFICATION.value,
            archived: false
        })
            .subscribe((messagesNotifications: MessageNotification[]) => {
                console.log('messagesNotifications: ', messagesNotifications);
                this._messagesNotifications.next(messagesNotifications);
            }, err => console.error(err));
    }

    getEntityNotifications() {
        this.userNotificationService.queryNotifications({
            notificationType: config.notificationTypes.ENTITY_NOTIFICATION.value,
            archived: false
        })
            .pipe(
                map(entityNotifications => {
                    return entityNotifications.map(
                        (notification: EntityNotification) => this.buildEntityNotificationBundle(notification)
                    )
                }),
                switchMap(bundles => forkJoinWithProgress(bundles)),
                switchMap(([finalResult, progress]) => merge(
                    progress.pipe(ignoreElements()),
                    finalResult
                ))
            )
            .subscribe((entityNotifications: UserNotificationBundle<EntityNotification>[]) => {
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
        this.userNotificationService.queryNotifications({
            notificationType: config.notificationTypes.ENTITY_ACCESS_NOTIFICATION.value,
            archived: false
        })
            .pipe(
                map(entityAccessNotifications =>
                    entityAccessNotifications.map((notification: EntityAccessNotification) => this.buildEntityAccessNotificationBundle(notification)
                )),
                switchMap(bundles => forkJoinWithProgress(bundles)),
                switchMap(([finalResult, progress]) => merge(
                    progress.pipe(ignoreElements()),
                    finalResult
                ))
            )
            .subscribe((entityAccessNotifications: UserNotificationBundle<EntityAccessNotification>[]) => {
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

