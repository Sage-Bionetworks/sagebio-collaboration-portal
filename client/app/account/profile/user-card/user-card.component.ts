import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../../../../shared/interfaces/auth/user.model';
import { NotificationService } from '../../../../components/notification/notification.service';

@Component({
    selector: 'user-card',
    template: require('./user-card.html'),
    styles: [require('./user-card.scss')],
})
export class UserCardComponent {
    private _user: User;

    static parameters = [Router, NotificationService];
    constructor(private router: Router,
        private notificationService: NotificationService) { }

    get user() {
        return this._user;
    }

    @Input()
    set user(user) {
        this._user = user;
    }

    edit(): void {
        this.notificationService.info('Edit Profile not implemented');
    }
}
