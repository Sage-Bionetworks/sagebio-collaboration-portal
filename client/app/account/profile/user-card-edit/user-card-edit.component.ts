import { Component, OnInit, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { User } from 'models/auth/user.model';
import { UserService } from 'components/auth/user.service';
import { PageTitleService } from 'components/page-title/page-title.service';
import { map } from 'lodash'

@Component({
    selector: 'user-card-edit',
    template: require('./user-card-edit.html'),
    styles: [require('./user-card-edit.scss')],
})
export class UserCardEditComponent implements OnInit, OnDestroy {
    @Input() user: User;
    @Output() editUser: EventEmitter<User> = new EventEmitter<User>();
    @Output() close: EventEmitter<any> = new EventEmitter<any>();

    private userSpecs = {};
    private editForm: FormGroup;
    private errors = {
        editUser: undefined,
    };

    static parameters = [FormBuilder, PageTitleService, UserService];

    constructor(
        private formBuilder: FormBuilder,
        private pageTitleService: PageTitleService,
        private userService: UserService,
    ) {
    }

    ngOnInit() {
        this.pageTitleService.title = 'Edit Profile';
        if (this.user) {
            console.log(`UserCardEditComponent user: ${JSON.stringify(this.user, null, 2)}`);
            this.editForm = this.formBuilder.group({
                // Declare edit form validators
                position: [this.user.position, []],
                info: [this.user.info, []],
                industry: [this.user.industry, []],
                location: [this.user.location, []],
                orcid: [this.user.orcid, []],
            });
        }
    }

    ngOnDestroy() { }

    onEditUser(): void {
        let editedUser = this.editForm.value;
        console.log(`UserCardEditComponent onEditUser:
            this.editedUser: ${JSON.stringify(editedUser, null, 2)}
        `);
        const patches = map(editedUser, (value, key) => ({
            op: 'replace',
            path: `/${key}`,
            value: value
        }))

        this.userService.updateUser(patches, this.user._id)
            .subscribe(user => {
                this.editUser.emit(user);
                this.close.emit(null);
            }, err => {
                console.error(`ERROR attempting to update user: ${err}`);
                this.errors.editUser = err.message;
            });
    }
}
