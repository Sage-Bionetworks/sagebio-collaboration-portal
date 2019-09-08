import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { filter } from 'rxjs/operators';
import _fp from 'lodash/fp';

import { SecondarySidenavService } from 'components/sidenav/secondary-sidenav/secondary-sidenav.service';
import { EntityPermissionService } from 'components/auth/entity-permission.service'
import { SocketService } from 'components/socket/socket.service';
import { Entity } from 'models/entities/entity.model';
import { UserProfile } from 'models/auth/user-profile.model';
import config from '../../../app/app.constants';
import { Resource } from 'models/entities/resources/resource.model';
import { Insight } from 'models/entities/insights/insight.model';
import { EntityPermission } from 'models/auth/entity-permission.model';
import { AuthService } from 'components/auth/auth.service';
import { combineLatest } from 'rxjs';

@Component({
    selector: 'share-sidenav',
    template: require('./share-sidenav.html'),
    styles: [require('./share-sidenav.scss')],
})
export class ShareSidenavComponent implements OnDestroy, AfterViewInit {
    private entity: Entity | Insight | Resource;
    private newForm: FormGroup;

    private users: (String | UserProfile)[];
    static parameters = [
        SecondarySidenavService,
        SocketService,
        Router,
        FormBuilder,
        EntityPermissionService,AuthService
    ];

    constructor(
        private sidenavService: SecondarySidenavService,
        private socketService: SocketService,
        private router: Router,
        private formBuilder: FormBuilder,
        private entityPermissionService: EntityPermissionService,
        private authService: AuthService
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
        const projectId: string = _fp.get('projectId')(this.entity)
        if (this.entity && projectId) {
            combineLatest(
                this.entityPermissionService.queryByEntityId(projectId),
                this.authService.authInfo()
            )
                .subscribe(([permissions, authInfo]) => {
                    this.users = _fp.flow(
                        _fp.filter<EntityPermission>(permission => permission.status === config.inviteStatusTypes.ACCEPTED.value),
                        _fp.map('user'),
                        _fp.uniqBy('_id'),
                        _fp.filter<UserProfile>(user => user._id !== authInfo.user._id)
                    )(permissions)
                })
        }
    }

    ngOnDestroy() {
        if (this.entity) {
            this.socketService.unsyncUpdates(`insight:${this.entity._id}:entity`);
        }
    }

    setEntity(entity: Entity): void {
        if (entity) {
            this.entity = entity;
        }
    }

    share(): void {
        let ShareDetails = this.newForm.value;
        console.log('ShareDetails: ', ShareDetails);
    }

    close(): void {
        this.sidenavService.close();
        this.sidenavService.destroyContentComponent();
    }
}
