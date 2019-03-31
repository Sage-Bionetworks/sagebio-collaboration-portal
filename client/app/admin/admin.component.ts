import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../components/auth/user.service';
import { PageTitleService } from '../../components/page-title/page-title.service';
import { User } from '../../../shared/interfaces/user.model';
// import { ImagePipe, WebpPipe } from '../../components/image/image.pipe';

@Component({
    selector: 'admin',
    template: require('./admin.html'),
    styles: [require('./admin.scss')],
})
export class AdminComponent implements OnInit, OnDestroy {
    private users: User[];

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
