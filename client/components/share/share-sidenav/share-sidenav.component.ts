import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { uniq } from 'lodash';

import { SecondarySidenavService } from 'components/sidenav/secondary-sidenav/secondary-sidenav.service';
import { EntityPermissionService } from 'components/auth/entity-permission.service'
import { SocketService } from 'components/socket/socket.service';
import { Entity } from 'models/entities/entity.model';
import { UserProfile } from 'models/auth/user-profile.model';
import config from '../../../app/app.constants';

@Component({
    selector: 'share-sidenav',
    template: require('./share-sidenav.html'),
    styles: [require('./share-sidenav.scss')],
})
export class ShareSidenavComponent implements OnDestroy, AfterViewInit {
    private entity: Entity;
    private newForm: FormGroup;

    private users: (String | UserProfile)[];
    static parameters = [SecondarySidenavService, SocketService, Router, FormBuilder, EntityPermissionService];

    constructor(
        private sidenavService: SecondarySidenavService,
        private socketService: SocketService,
        private router: Router,
        private formBuilder: FormBuilder,
        private entityPermissionService: EntityPermissionService
    ) {
        this.router.events.pipe(filter(event => event instanceof NavigationStart)).subscribe(_ => this.close());
        this.newForm = formBuilder.group({
            shareUsers: ['', [Validators.required]],
            comments: [
                '',
                [
                    Validators.maxLength(config.models.share.comment.maxlength),
                ],
            ],
        });
    }

    ngAfterViewInit() {
        if (this.entity) {
            this.entityPermissionService.queryByEntity(this.entity)
                .subscribe(permissions => {
                    this.users = uniq(permissions
                        .filter(permission => (permission.status === config.inviteStatusTypes.ACCEPTED.value))
                        .map(permission => permission.user))
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
