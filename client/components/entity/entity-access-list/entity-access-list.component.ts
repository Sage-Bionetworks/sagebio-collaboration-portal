import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
    debounceTime,
    distinctUntilChanged
} from 'rxjs/operators';
import { Entity } from 'models/entity.model';
import { EntityPermission } from 'models/auth/entity-permission.model';
import { EntityPermissionService } from 'components/auth/entity-permission.service';
import { UserProfile } from 'models/auth/user-profile.model';
import { UserService } from 'components/auth/user.service';

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

    static parameters = [FormBuilder, EntityPermissionService, UserService];
    constructor(private formBuilder: FormBuilder,
        private entityPermissionService: EntityPermissionService,
        private userService: UserService) {

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
        console.log('entity', this.entity);
    }

    selectUser(user: UserProfile): void {
        this.selectedUser = user;
    }
}
