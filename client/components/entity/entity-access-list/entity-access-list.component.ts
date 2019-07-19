import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
    debounceTime,
    distinctUntilChanged
} from 'rxjs/operators';
import { find } from 'lodash/fp';
import { Entity } from 'models/entity.model';
import { EntityPermission } from 'models/auth/entity-permission.model';
import { EntityPermissionService } from 'components/auth/entity-permission.service';
import { UserProfile } from 'models/auth/user-profile.model';
import { UserService } from 'components/auth/user.service';
import config from '../../../app/app.constants';

@Component({
    selector: 'entity-access-list',
    template: require('./entity-access-list.html'),
    styles: [require('./entity-access-list.scss')],
})
export class EntityAccessListComponent implements OnInit, AfterViewInit {
    @Input() entity: Entity;
    private permissions: EntityPermission[] = [];
    private inviteForm: FormGroup;
    private userResults: UserProfile[];
    private selectedUser: UserProfile;
    private listAvatarSize;
    private optionAvatarSize;
    private accessTypes: any[];

    static parameters = [FormBuilder, EntityPermissionService, UserService];
    constructor(private formBuilder: FormBuilder,
        private entityPermissionService: EntityPermissionService,
        private userService: UserService) {

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
            }, err => console.log(err));
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
            });
    }

    ngAfterViewInit() {
        // find all the permission associated to this entity
        this.entityPermissionService.queryByEntity(this.entity)
            .subscribe(permissions => {
                this.permissions = permissions;
            }, err => console.log(err));
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
                    console.log('permission added', permission);
                }, err => console.log(err));
        }
    }

    removeCollaborator($event, permission: EntityPermission): void {
        $event.stopPropagation();
        this.entityPermissionService.delete(permission)
            .subscribe(perm => {
                console.log('Permission removed', perm);
            }, err => console.log(err));
    }

    changeCollaboratorAccess($event, permission: EntityPermission): void {
        const newAccess = find({ value: $event.value }, this.accessTypes)
            .value;
        this.entityPermissionService.changeAccess(permission, newAccess)
            .subscribe(perm => {
                console.log('Updated permission', perm);
            }, err => console.log(err));
    }
}
