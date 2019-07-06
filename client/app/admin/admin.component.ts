import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'components/auth/user.service';
import { PageTitleService } from 'components/page-title/page-title.service';
import { UserProfile } from 'models/auth/user-profile.model';

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

    ngOnInit() {
        this.pageTitleService.title = 'Admin';
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
