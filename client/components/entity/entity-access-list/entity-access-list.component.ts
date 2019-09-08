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

@Component({
    selector: 'entity-access-list',
    template: require('./entity-access-list.html'),
    styles: [require('./entity-access-list.scss')],
})
export class EntityAccessListComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() entity: Entity;
    @Input() user: UserProfile;
    @Input() disabled = false;
    private permissions: EntityPermission[] = [];

    private inviteForm: FormGroup;
    private errors = {
        inviteForm: undefined
    };
    private userResults: UserProfile[];
    private selectedUser: UserProfile;
    private listAvatarSize;
    private optionAvatarSize;
    private accessTypes: any[];

    static parameters = [FormBuilder, EntityPermissionService, UserService, SocketService];
    constructor(private formBuilder: FormBuilder,
        private entityPermissionService: EntityPermissionService,
        private userService: UserService,
        private socketService: SocketService) {

        this.listAvatarSize = config.avatar.size.small;
        this.optionAvatarSize = config.avatar.size.nano;
        this.accessTypes = Object.values(config.accessTypes);
        this.inviteForm = this.formBuilder.group({
            username: ['', [
            ]],
        });

        this.userService.searchUserByUsername(this.inviteForm.controls.username.valueChanges)
            .subscribe(users => {
                this.userResults = users;
            }, err => console.error(err));
    }

    ngOnInit() {
        this.inviteForm
            .controls
            .username
            .valueChanges.pipe(
                debounceTime(50),
                distinctUntilChanged()
            )
            .subscribe(username => {
                if (this.selectedUser) {
                    if (username !== this.selectedUser.username) {
                        this.selectedUser = undefined;
                    }
                }
                this.errors.inviteForm = null;
            });
    }

    ngAfterViewInit() {
        if (this.entity) {
            this.entityPermissionService.queryByEntity(this.entity)
                .subscribe(permissions => {
                    this.permissions = permissions;
                    this.socketService.syncUpdates(
                        `entity:${this.entity._id}:entityPermission`,
                        this.permissions
                    );
                }, err => console.error(err));
        }
    }

    ngOnDestroy() {
        if (this.entity) {
            this.socketService.unsyncUpdates(`entity:${this.entity._id}:entityPermission`);
        }
    }

    selectUser(user: UserProfile): void {
        this.selectedUser = user;
    }

    addCollaborator(): void {
        if (this.selectedUser) {
            const newPermission: EntityPermission = {
                entityId: this.entity._id,
                entityType: config.entityTypes.PROJECT.value,
                user: this.selectedUser._id,
                access: config.accessTypes.READ.value
            };
            this.entityPermissionService.create(newPermission)
                .subscribe(permission => {
                    this.inviteForm.get('username').setValue('');
                }, err => {
                    console.log(err);
                    this.errors.inviteForm = err.message;
                });
        }
    }

    removeCollaborator($event, permission: EntityPermission): void {
        $event.stopPropagation();
        this.entityPermissionService.delete(permission)
            .subscribe(perm => {
                //
            }, err => {
                console.log(err);
                this.errors.inviteForm = err.message;
            });
    }

    changeCollaboratorAccess($event: MatSelectChange, permission: EntityPermission): void {
        const newAccess = find({ value: $event.value }, this.accessTypes)
            .value;
        this.entityPermissionService.changeAccess(permission, newAccess)
            .subscribe(perm => {
                //
            }, err => {
                console.error(err);
                this.errors.inviteForm = err.message;
            });
    }

    freezePermission(permission: EntityPermission): boolean {
        const isCurrentUser = (<UserProfile>permission.user)._id === this.user._id;
        const currentUserIsAppAdmin = this.user.role === config.userRoles.ADMIN.value;
        const isProjectAdmin = permission.access === config.accessTypes.ADMIN.value
            && permission.status === config.inviteStatusTypes.ACCEPTED.value;
        const isLastProjectAdmin = this.permissions
            .filter(perm =>
                (perm.access === config.accessTypes.ADMIN.value
                    && perm.status === config.inviteStatusTypes.ACCEPTED.value)
            ).length <= 1;
        return (isCurrentUser && !currentUserIsAppAdmin) || (isProjectAdmin && isLastProjectAdmin);
    }

    isPending(permission: EntityPermission): boolean {
        return permission.status === config.inviteStatusTypes.PENDING.value;
    }

    isDeclined(permission: EntityPermission): boolean {
        return permission.status === config.inviteStatusTypes.DECLINED.value;
    }
}
