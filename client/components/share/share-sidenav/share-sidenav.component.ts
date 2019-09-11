import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { filter, map, flatMap } from 'rxjs/operators';
import { flow, get, filter as fpFilter, map as fpMap, uniqBy } from 'lodash/fp';

import { SecondarySidenavService } from 'components/sidenav/secondary-sidenav/secondary-sidenav.service';
import { EntityPermissionService } from 'components/auth/entity-permission.service'
import { SocketService } from 'components/socket/socket.service';
import { Entity } from 'models/entities/entity.model';
import { UserProfile } from 'models/auth/user-profile.model';
import config from '../../../app/app.constants';
import { EntityPermission } from 'models/auth/entity-permission.model';
import { AuthService } from 'components/auth/auth.service';
import { combineLatest, Observable, of } from 'rxjs';
import { EntityNotification } from 'models/user-notification/entity-notificiation.model';
import { UserNotificationService } from 'components/user-notification/user-notification.service';
import { DeltaOperation } from 'quill';
import { NotificationService } from 'components/notification/notification.service';
import { ProjectService } from '../../../app/project/project.service';
import { UserService } from 'components/auth/user.service';

@Component({
    selector: 'share-sidenav',
    template: require('./share-sidenav.html'),
    styles: [require('./share-sidenav.scss')],
})
export class ShareSidenavComponent implements OnDestroy, AfterViewInit {
    private entity: Entity;
    private entityType: string;
    private newForm: FormGroup;

    private users: (String | UserProfile)[] = [];
    static parameters = [
        SecondarySidenavService,
        SocketService,
        Router,
        FormBuilder,
        EntityPermissionService,
        AuthService,
        UserNotificationService,
        NotificationService,
        ProjectService,
        UserService
    ];

    constructor(
        private sidenavService: SecondarySidenavService,
        private socketService: SocketService,
        private router: Router,
        private formBuilder: FormBuilder,
        private entityPermissionService: EntityPermissionService,
        private authService: AuthService,
        private userNotificationService: UserNotificationService,
        private notificationService: NotificationService,
        private projectService: ProjectService,
        private userService: UserService,
    ) {
        this.router.events.pipe(filter(event => event instanceof NavigationStart)).subscribe(_ => this.close());
        this.newForm = formBuilder.group({
            shareWithUsers: ['', [Validators.required]],
            comments: [
                '',
                [
                    Validators.maxLength(config.models.share.comment.maxlength),
                ],
            ],
        });
    }

    ngAfterViewInit() {
        if (this.entityType === config.entityTypes.PROJECT.value) {
            this.authService.authInfo()
            .pipe(
                flatMap((authInfo) => {
                    if (this.entity.visibility === config.entityVisibility.PRIVATE.value) {
                        return this.getUsersWithEntityPermissions(this.entity._id, authInfo.user)
                    }

                    return this.getAllUsers(authInfo.user)
                })
            ).subscribe(users => this.users = users)
        } else {
            const projectId: string = get('projectId')(this.entity)
            if (projectId) {
                combineLatest(this.projectService.get(projectId), this.authService.authInfo())
                .pipe(
                    flatMap(([project, authInfo]) => {
                        if (project.visibility === config.entityVisibility.PRIVATE.value) {
                            return this.getUsersWithEntityPermissions(projectId, authInfo.user)
                        }

                        return this.getAllUsers(authInfo.user)
                    })
                ).subscribe(users => this.users = users)
            } else {
                this.authService.authInfo().pipe(
                    flatMap((authInfo) => this.getAllUsers(authInfo.user)),
                ).subscribe(users => this.users = users)
            }
        }
    }

    ngOnDestroy() {
        if (this.entity) {
            this.socketService.unsyncUpdates(`${this.entityType}:${this.entity._id}:entity`);
        }
    }

    getUsersWithEntityPermissions(entityId: string, currentUser: UserProfile) {
        return this.entityPermissionService.queryByEntityId(entityId)
            .pipe(
                map(permissions => {
                    return flow(
                        fpFilter<EntityPermission>(permission => permission.status === config.inviteStatusTypes.ACCEPTED.value),
                        fpMap('user'),
                        uniqBy('_id'),
                        (users: UserProfile[]) => this.withoutCurrentUser(users, currentUser)
                    )(permissions)
                })
            )
    }

    getAllUsers(currentUser: UserProfile): Observable<UserProfile[]> {
        return this.userService.query()
            .pipe(
                map((users) => this.withoutCurrentUser(users, currentUser)),
            )
    }

    withoutCurrentUser(users: UserProfile[], currentUser: UserProfile) {
        return users.filter(user => user._id !== currentUser._id)
    }

    setEntity(entity: Entity, entityType: string): void {
        if (entity) {
            this.entity = entity;
            this.entityType = entityType
        }
    }

    share(): void {
        let ShareDetails: { comments: DeltaOperation, shareWithUsers: UserProfile[] } = this.newForm.value;

        ShareDetails.shareWithUsers.forEach(user => {
            const notification: EntityNotification = {
                notificationType: config.notificationTypes.ENTITY_NOTIFICATION.value,
                entityId: this.entity._id,
                entityType: this.entityType,
                user: user._id,
                messageBody: JSON.stringify(ShareDetails.comments),
            }

            this.userNotificationService.createNotification<EntityNotification>(notification)
                .subscribe(() => {
                    this.notificationService.info("Notification sent.")
                    this.close()
                }, err => {
                    console.error(err);
                })
        });
    }

    close(): void {
        this.sidenavService.close();
        this.sidenavService.destroyContentComponent();
    }
}
