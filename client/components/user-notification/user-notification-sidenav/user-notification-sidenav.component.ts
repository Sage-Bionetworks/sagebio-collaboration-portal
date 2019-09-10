import { Component, OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { of } from 'rxjs';
import { filter } from 'rxjs/operators';
import  _fp from "lodash/fp";

import { InsightService } from 'components/insight/insight.service';
import { SecondarySidenavService } from 'components/sidenav/secondary-sidenav/secondary-sidenav.service';

import { UserNotificationService } from '../user-notification.service';
import { EntityPermissionService } from 'components/auth/entity-permission.service';

import config from '../../../app/app.constants';

import { UserNotificationBundle } from 'models/user-notification/user-notification-bundle.model'

import { MessageNotification } from 'models/user-notification/message-notificiation.model'
import { EntityNotification } from 'models/user-notification/entity-notificiation.model'
import { EntityAccessNotification } from 'models/user-notification/entity-access-notificiation.model'


// ---------------------------------------------------------------
// TODO: Do not refer to something in app/, instead move ProjectService to components
import { ProjectService } from '../../../app/project/project.service';
import { ResourceService } from 'components/resource/resource.service';
import { ToolService } from '../../../app/tool/tool.service';
import { DataCatalogService } from '../../../app/data-catalog/data-catalog.service';
import { Router, NavigationStart } from '@angular/router';
import { UserNotification } from 'models/user-notification/user-notification.model';
import { SocketService } from 'components/socket/socket.service';
import { Entity } from 'models/entities/entity.model';
import { EntityPermission } from 'models/auth/entity-permission.model';
// ---------------------------------------------------------------


@Component({
    selector: 'user-notification-sidenav',
    template: require('./user-notification-sidenav.html'),
    styles: [require('./user-notification-sidenav.scss')]
})

export class UserNotificationSidenavComponent implements OnDestroy {
    // private socketEventName: string;
    private notificationTypes = config.notificationTypes
    private notificationBundles$ = new BehaviorSubject<UserNotificationBundle<UserNotification>[]>([]);
    private notifications$ = new BehaviorSubject<UserNotification[]>([]);

    static parameters = [
        SecondarySidenavService,
        UserNotificationService,
        EntityPermissionService,
        ProjectService,
        InsightService,
        ResourceService,
        ToolService,
        DataCatalogService,
        Router,
        SocketService,
    ];
    constructor(
        private sidenavService: SecondarySidenavService,
        private userNotificationService: UserNotificationService,
        private entityPermissionService: EntityPermissionService,
        private projectService: ProjectService,
        private insightService: InsightService,
        private resourceServive: ResourceService,
        private toolService: ToolService,
        private dataCatalogService: DataCatalogService,
        private router: Router,
        private socketService: SocketService,
    ) {
        this.router.events.pipe(
            filter(event => event instanceof NavigationStart)
        ).subscribe(_ => this.close());

        this.socketService.syncArraySubject(
            "notifications",
            this.notifications$,
            (items: UserNotification[]) => {
                return _fp.orderBy('createdAt', 'desc', items);
            }
        );
    }

    getAssociatedEntity(notification: EntityNotification) {
        switch (notification.entityType) {
            case config.entityTypes.PROJECT.value:
                return this.projectService.get(notification.entityId)
            case config.entityTypes.INSIGHT.value:
                return this.insightService.getInsight(notification.entityId)
            case config.entityTypes.RESOURCE.value:
                return this.resourceServive.getResource(notification.entityId)
            case config.entityTypes.TOOL.value:
                return this.toolService.get(notification.entityId)
            case config.entityTypes.DATA_CATALOG.value:
                return this.dataCatalogService.get(notification.entityId)
            default:
                return of(null)
        }
    }

    getEntityPermission(notification: EntityAccessNotification) {
        return notification.notificationType === config.notificationTypes.ENTITY_ACCESS_NOTIFICATION.value
            ? this.entityPermissionService.getPermission(notification.entityPermissionId as string)
            : of(null)
    }

    buildMessageNotificationBundle(notification: MessageNotification): UserNotificationBundle<MessageNotification> {
        return { notification }
    }

    async buildEntityNotificationBundle(notification: EntityNotification): Promise<UserNotificationBundle<EntityNotification>> {
        return Promise.resolve({
            notification,
            associatedEntity: await this.getAssociatedEntity(notification).toPromise<Entity>()
        })
    }

    async buildEntityAccessNotificationBundle(notification: EntityAccessNotification): Promise<UserNotificationBundle<EntityAccessNotification>> {
        return Promise.resolve({
            notification,
            associatedEntity: await this.getAssociatedEntity(notification).toPromise<Entity>(),
            entityPermission: await this.getEntityPermission(notification).toPromise<EntityPermission>()
        })
    }

    buildBundleByType = async (notification: UserNotification): Promise<UserNotificationBundle<UserNotification>> => {
        switch (notification.notificationType) {
            case config.notificationTypes.MESSAGE_NOTIFICATION.value:
                return this.buildMessageNotificationBundle(notification as MessageNotification)
            case config.notificationTypes.ENTITY_NOTIFICATION.value:
                return await this.buildEntityNotificationBundle(notification as EntityNotification)
            case config.notificationTypes.ENTITY_ACCESS_NOTIFICATION.value:
                return await this.buildEntityAccessNotificationBundle(notification as EntityAccessNotification)
        }
    }

    ngOnInit() {
        this.userNotificationService.queryNotifications({ archived: false })
            .subscribe(notifications => this.notifications$.next(notifications))

        this.notifications$.subscribe(notifications => {
            const notificationBundlesPromises = notifications.map(this.buildBundleByType)

            Promise.all(notificationBundlesPromises)
                .then(notifications => this.notificationBundles$.next(notifications))
        })
    }

    ngOnDestroy() {
        this.socketService.unsyncUpdates(this.notifications$);
    }

    close(): void {
        this.sidenavService.close();
    }
}

