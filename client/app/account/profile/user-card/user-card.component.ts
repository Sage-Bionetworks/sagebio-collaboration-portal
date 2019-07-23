import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'models/auth/user.model';
import { NotificationService } from 'components/notification/notification.service';

@Component({
    selector: 'user-card',
    template: require('./user-card.html'),
    styles: [require('./user-card.scss')],
})
export class UserCardComponent {
    private _user: User;
    private isEditing = false;  // WIP #170 - Indicates whether user-card is in view or edit mode

    static parameters = [Router, NotificationService];
    constructor(private router: Router,
        private notificationService: NotificationService) { }

    get buttonColor() {
        if (this.isEditing) return 'accent';
        return 'primary';
    }

    get buttonText() {
        if (this.isEditing) return 'Save Profile';
        return 'Edit Profile';
    }

    get user() {
        return this._user;
    }

    @Input()
    set user(user) {
        this._user = user;
    }

    // WIP #170 - Initial implementation of edit data in user-card
    onUserCardButtonClick(): void {
        // WIP #170 - Before switching modes, be sure you save the user data 😁
        this.isEditing = !this.isEditing;
    }
}
