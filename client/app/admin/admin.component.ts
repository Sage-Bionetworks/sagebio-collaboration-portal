import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from 'components/auth/user.service';
import { PageTitleService } from 'components/page-title/page-title.service';
import { UserProfile } from 'models/auth/user-profile.model';
import { UserAvatarComponent } from '../../components/user-avatar/user-avatar.component';
import config from '../app.constants';

@Component({
    selector: 'admin',
    template: require('./admin.html'),
    styles: [require('./admin.scss')],
})
export class AdminComponent implements OnInit, OnDestroy {
    private users: UserProfile[];
    private avatarSize;

    static parameters = [UserService, PageTitleService];
    constructor(private userService: UserService,
        private pageTitleService: PageTitleService) {
        this.userService.query()
            .subscribe(users => this.users = users);
        this.avatarSize = config.avatar.size.small;
    }

    ngOnInit() {
        this.pageTitleService.title = 'Admin';
    }

    ngOnDestroy() { }

    deleteUser(user) {
        this.userService.remove(user)
            .subscribe(deletedUser => {
                this.users.splice(this.users.indexOf(deletedUser), 1);
            });
    }
}
