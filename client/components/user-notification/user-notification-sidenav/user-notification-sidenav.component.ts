import { Component, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { of, forkJoin, merge } from 'rxjs';
import { switchMap, map, ignoreElements } from 'rxjs/operators';

import { InsightService } from 'components/insight/insight.service';
import { SecondarySidenavService } from 'components/sidenav/secondary-sidenav/secondary-sidenav.service';
import { UserPermissionDataService } from 'components/auth/user-permission-data.service';
import { UserNotificationService } from '../user-notification.service';

import { NotificationBundle } from '../models/notification-bundle.model';
import { forkJoinWithProgress } from 'components/rxjs/util';
import config from '../../../app/app.constants';

// ---------------------------------------------------------------
// TODO: Do not refer to something in app/, instead move ProjectService to components
import { ProjectService } from '../../../app/project/project.service';
// ---------------------------------------------------------------

// import { Project } from 'models/entities/project.model';
// import { EntityPermission } from 'models/auth/entity-permission.model';
// import { pickBy, identity } from 'lodash/fp';
// import { SocketService } from 'components/socket/socket.service';
// import { MessageNotification } from '../models/message-notificiation.model';
// import { EntityNotification } from '../models/entity-notificiation.model';
// import { EntityAccessNotification } from '../models/entity-access-notificiation.model';



@Component({
    selector: 'user-notification-sidenav',
    template: require('./user-notification-sidenav.html'),
    styles: [require('./user-notification-sidenav.scss')]
})

export class UserNotificationSidenavComponent implements OnDestroy {
    // private invites: NotificationBundle[] = [];
    // private socketEventName: string;

    private avatarSize = 40;

    private _messagesNotifications: BehaviorSubject<NotificationBundle[]> = new BehaviorSubject<NotificationBundle[]>([]);
    private _entityNotifications: BehaviorSubject<NotificationBundle[]> = new BehaviorSubject<NotificationBundle[]>([]);
    private _entityAccessNotifications: BehaviorSubject<NotificationBundle[]> = new BehaviorSubject<NotificationBundle[]>([]);

    static parameters = [
        SecondarySidenavService,
        UserPermissionDataService,
        UserNotificationService,
        ProjectService,
        InsightService
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

    getEntityDetails(entityType: string, entityID: string) {
        switch (entityType) {
            case config.entityTypes.PROJECT.value:
                return this.projectService.getProject(entityID)
            case config.entityTypes.INSIGHT.value:
                return this.insightService.getInsight(entityID)
            default:
                return of(null)
        }
    }

    createNotificationBundle(notification) {
        return of(notification)
            .pipe(
                switchMap(inv => forkJoin({
                    notification: of(notification),
                    associatedEntity: this.getEntityDetails(inv.entityType, inv.entityId)
                }))
            )
    }

    getMessagesNotifications() {
        this.userNotificationService.queryMessageNotifications()
            .pipe(
                map(messageNotifications => messageNotifications.map(notification => this.createNotificationBundle(notification))),
                switchMap(bundles => forkJoinWithProgress(bundles)),
                switchMap(([finalResult, progress]) => merge(
                    progress.pipe(ignoreElements()),
                    finalResult
                ))
            )
            .subscribe((messagesNotifications: NotificationBundle[]) => {
                console.log('messagesNotifications: ', messagesNotifications);
                this._messagesNotifications.next(messagesNotifications);
            }, err => console.error(err));
    }

    getEntityNotifications() {
        this.userNotificationService.queryEntityNotifications()
            .pipe(
                map(entityNotifications => entityNotifications.map(notification => this.createNotificationBundle(notification))),
                switchMap(bundles => forkJoinWithProgress(bundles)),
                switchMap(([finalResult, progress]) => merge(
                    progress.pipe(ignoreElements()),
                    finalResult
                ))
            )
            .subscribe((entityNotifications: NotificationBundle[]) => {
                console.log('entityNotifications: ', entityNotifications);
                this._entityNotifications.next(entityNotifications);
            }, err => console.error(err));
    }

    getEntityAccessNotifications() {
        this.userNotificationService.queryEntityAccessNotifications()
            .pipe(
                map(entityAceessNotifications => entityAceessNotifications.map(notification => this.createNotificationBundle(notification))),
                switchMap(bundles => forkJoinWithProgress(bundles)),
                switchMap(([finalResult, progress]) => merge(
                    progress.pipe(ignoreElements()),
                    finalResult
                ))
            )
            .subscribe((entityAccessNotifications: NotificationBundle[]) => {
                console.log('entityAccessNotifications: ', entityAccessNotifications);
                this._entityAccessNotifications.next(entityAccessNotifications);
            }, err => console.error(err));
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

