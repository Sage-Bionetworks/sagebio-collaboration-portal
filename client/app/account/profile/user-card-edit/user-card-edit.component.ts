import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'models/auth/user.model';
import { NotificationService } from 'components/notification/notification.service';

@Component({
    selector: 'user-card-edit',
    template: require('./user-card-edit.html'),
    styles: [require('./user-card-edit.scss')],
})
export class UserCardEditComponent {
    private isEditing = false;

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

    @Input() user: User;
    // @Output() editUser: EventEmitter<User> = new EventEmitter<User>();
    // @Output() close: EventEmitter<any> = new EventEmitter<any>();

    // onUserCardButtonClick(): void {
    //     this.isEditing = !this.isEditing;
    // }
}
