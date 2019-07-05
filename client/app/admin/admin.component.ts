import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../components/auth/user.service';
import { PageTitleService } from '../../components/page-title/page-title.service';
// import { Router, ActivatedRoute } from '@angular/router';
import { UserProfile } from '../../../shared/interfaces/user-profile.model';
import config from '../../app/app.constants';

// import { ImagePipe, WebpPipe } from '../../components/image/image.pipe';

@Component({
    selector: 'admin',
    template: require('./admin.html'),
    styles: [require('./admin.scss')],
})
export class AdminComponent implements OnInit, OnDestroy {
    private users: UserProfile[];

    static parameters = [UserService, PageTitleService];
    constructor(private userService: UserService,
        private pageTitleService: PageTitleService) { }
        private avatarSize = 40;
    ngOnInit() {
        this.pageTitleService.title = 'Admin';
        this.avatarSize = config.avatar.size.small;
        // Use the user service to fetch all users
        this.userService.query().subscribe(users => {
            this.users = users;
        });
    }

    ngOnDestroy() { }

    deleteUser(user) {
        this.userService.remove(user).subscribe(deletedUser => {
            this.users.splice(this.users.indexOf(deletedUser), 1);
        });
    }
}
