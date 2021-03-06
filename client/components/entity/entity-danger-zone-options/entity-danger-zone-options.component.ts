import { Component, OnInit, OnDestroy, Input, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material';
import {
    debounceTime,
    distinctUntilChanged
} from 'rxjs/operators';
import { find, filter } from 'lodash/fp';
import { Entity } from 'models/entities/entity.model';
import { EntityPermission } from 'models/auth/entity-permission.model';
import { EntityPermissionService } from 'components/auth/entity-permission.service';
import { UserProfile } from 'models/auth/user-profile.model';
import { UserService } from 'components/auth/user.service';
import { SocketService } from 'components/socket/socket.service';
import config from '../../../app/app.constants';
import { NotificationService } from 'components/notification/notification.service';
import { EntityService } from '../entity.service';

@Component({
    selector: 'entity-danger-zone-options',
    template: require('./entity-danger-zone-options.html'),
    styles: [require('./entity-danger-zone-options.scss')],
})
export class EntityDangerZoneOptionsComponent {
    @Input() entity: Entity;
    @Input() entityName: string;
    @Input() entityService: EntityService<Entity>;
    @Input() disabled = false;

    static parameters = [NotificationService];
    constructor(private notificationService: NotificationService) {

    }

    makePublic(): void {
        this.entityService.makePublic(this.entity)
            .subscribe(entity => {
                this.notificationService.info(`The ${this.entityName} is now public.`);
            }, err => {
                console.error(err);
                this.notificationService.error(`Unable to make the ${this.entityName} public.`);
            });
    }

    makePrivate(): void {
        this.entityService.makePrivate(this.entity)
            .subscribe(entity => {
                this.notificationService.info(`The ${this.entityName} is now private.`);
            }, err => {
                console.error(err);
                this.notificationService.error(`Unable to make the ${this.entityName} private.`);
            });
    }

    archive(): void {
        console.log('Entity', this.entity);
        this.notificationService.info('Not implemented');
    }

    delete(): void {
        this.notificationService.info('Not implemented');
    }
}
