import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
// import { MatDialog, MatDialogConfig } from '@angular/material';
import { User } from '../../../../../shared/interfaces/user.model';

@Component({
    selector: 'user-card',
    template: require('./user-card.html'),
    styles: [require('./user-card.scss')],
})
export class UserCardComponent {
    private _user: User;

    static parameters = [Router];
    constructor(private router: Router) { }

    get user() {
        return this._user;
    }

    @Input()
    set user(user) {
        this._user = user;
    }
}
